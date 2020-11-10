import { createStore, createHook, createContainer } from "react-sweet-state";
import {
  append,
  assoc,
  assocPath,
  compose,
  concat,
  difference,
  endsWith,
  filter,
  flatten,
  isNil,
  length,
  map,
  max,
  mergeAll,
  not,
  path,
  prepend,
  prop,
  propEq,
  reduce,
  reject,
  split,
  startsWith,
  values
} from "ramda";
import {
  getAnchorPart,
  getLatestChangesByAnchor,
  recursiveTreeShake
} from "utils/common";

const removeUnderRemoval = () => ({ getState, setState }) => {
  const currentState = getState();
  const nextChangeObjects = assoc(
    "underRemoval",
    {},
    currentState.changeObjects
  );
  setState(assoc("changeObjects", nextChangeObjects, currentState));
};

const removeUnsavedChanges = () => ({ getState, setState }) => {
  const currentState = getState();
  const nextChangeObjects = assoc("unsaved", {}, currentState.changeObjects);
  setState(assoc("changeObjects", nextChangeObjects, currentState));
};

const setLatestChanges = changeObjects => ({ getState, setState }) => {
  setState(assoc("latestChanges", changeObjects, getState()));
};

const setSavedChanges = (changeObjects, anchor) => ({ getState, setState }) => {
  if (anchor) {
    setState(
      assocPath(split(".", anchor), changeObjects, getState().changeObjects)
    );
  } else {
    const nextState = assocPath(
      ["changeObjects", "saved"],
      changeObjects,
      getState()
    );
    setState(nextState);
  }
};

const Store = createStore({
  initialState: {
    changeObjects: {
      saved: {},
      unsaved: {},
      underRemoval: {}
    },
    isRestrictionDialogVisible: false,
    latestChanges: {}
  },
  actions: {
    addCriterion: () => (sectionId, rajoiteId) => ({ getState, setState }) => {
      const currentChangeObjects = prop("changeObjects", getState());
      const rajoitekriteeritChangeObjects = filter(
        changeObj =>
          startsWith(`${sectionId}.${rajoiteId}.kriteerit`, changeObj.anchor),
        currentChangeObjects[sectionId] || []
      );

      /**
       * Etsitään suurin käytössä oleva kriteerin numero ja muodostetaan seuraava
       * numero lisäämällä lukuun yksi.
       */
      const nextCriterionAnchorPart =
        length(rajoitekriteeritChangeObjects) > 0
          ? reduce(
          max,
          -Infinity,
          map(changeObj => {
            return parseInt(getAnchorPart(changeObj.anchor, 3), 10);
          }, rajoitekriteeritChangeObjects)
        ) + 1
          : 0;

      /**
       * Luodaan
       */
      const nextChangeObjects = assoc(
        sectionId,
        append(
          {
            anchor: `${sectionId}.${rajoiteId}.kriteerit.${nextCriterionAnchorPart}.valintaelementti.autocomplete`,
            properties: {
              value: ""
            }
          },
          currentChangeObjects[sectionId] || []
        ),
        currentChangeObjects
      );
      setState({ ...getState(), changeObjects: nextChangeObjects });
    },
    createTextBoxChangeObject: (sectionId, koodiarvo) => ({
      getState,
      setState
    }) => {
      if (sectionId) {
        const currentChangeObjects = getState().changeObjects;
        const textBoxChangeObjects = filter(
          changeObj =>
            startsWith(`${sectionId}.${koodiarvo}`, changeObj.anchor) &&
            endsWith(".kuvaus", changeObj.anchor) &&
            !startsWith(`${sectionId}.${koodiarvo}.0`, changeObj.anchor),
          concat(
            currentChangeObjects.unsaved[sectionId] || [],
            currentChangeObjects.saved[sectionId] || []
          ) || []
        );

        const textBoxNumber =
          length(textBoxChangeObjects) > 0
            ? reduce(
                max,
                -Infinity,
                map(changeObj => {
                  return parseInt(getAnchorPart(changeObj.anchor, 2), 10);
                }, textBoxChangeObjects)
              ) + 1
            : 1;

        /**
         * Luodaan
         */
        const nextChangeObjects = assocPath(
          ["unsaved", sectionId],
          append(
            {
              anchor: `${sectionId}.${koodiarvo}.${textBoxNumber}.kuvaus`,
              properties: {
                value: ""
              }
            },
            currentChangeObjects.unsaved[sectionId] || []
          ),
          currentChangeObjects
        );
        console.info(nextChangeObjects);
        setState({...getState(), changeObjects: nextChangeObjects});
      }
    },
    initializeChanges: changeObjects => ({dispatch}) => {
      dispatch(setSavedChanges(changeObjects));
      dispatch(setLatestChanges({}));
      dispatch(removeUnderRemoval());
      dispatch(removeUnsavedChanges());
    },
    removeChangeObjectByAnchor: anchor => ({getState, setState}) => {
      const allCurrentChangeObjects = getState().changeObjects;
      const anchorParts = split("_", getAnchorPart(anchor, 0));
      const unsavedFullPath = prepend("unsaved", anchorParts);
      const changeObjects = path(unsavedFullPath, allCurrentChangeObjects);
      if (changeObjects) {
        let nextChangeObjects = assocPath(
          unsavedFullPath,
          filter(compose(not, propEq("anchor", anchor)), changeObjects),
          getState().changeObjects
        );
        nextChangeObjects = recursiveTreeShake(
          unsavedFullPath,
          nextChangeObjects
        );
        setState(assoc("changeObjects", nextChangeObjects, getState()));
      }
    },
    setChanges: (changeObjects, anchor = "") => ({
      getState,
      dispatch,
      setState
    }) => {
      const currentChangeObjects = getState().changeObjects;
      const anchorParts = split("_", anchor);

      const unsavedFullPath = prepend("unsaved", anchorParts).filter(Boolean);
      const savedFullPath = prepend("saved", anchorParts).filter(Boolean);
      const underRemovalFullPath = prepend("underRemoval", anchorParts).filter(
        Boolean
      );

      const savedByAnchor = path(savedFullPath, getState().changeObjects) || [];
      const unsavedChangeObjects = difference(changeObjects, savedByAnchor);
      const savedChangeObjects = difference(savedByAnchor, changeObjects);

      /**
       * Etsitään ankkuria käyttäen vastaavat underRemoval-tilassa olevat
       * muutokset.
       */
      const underRemovalByAnchor =
        path(underRemovalFullPath, getState().changeObjects) || [];

      /**
       * Etsitään löydetyistä muutosobjekteista ne, joita vastaavia muutos-
       * objekteja ollaan tallentamassa.
       */
      const freshNewChangeObjects = difference(
        unsavedChangeObjects,
        underRemovalByAnchor
      );

      let nextChangeObjects = assocPath(
        unsavedFullPath,
        freshNewChangeObjects,
        currentChangeObjects
      );

      nextChangeObjects = assocPath(
        underRemovalFullPath,
        savedChangeObjects,
        nextChangeObjects
      );

      /**
       * Ravistetaan muutosten puusta tyhjät objektit pois.
       **/
      nextChangeObjects = recursiveTreeShake(
        unsavedFullPath,
        nextChangeObjects
      );
      nextChangeObjects = recursiveTreeShake(
        underRemovalFullPath,
        nextChangeObjects
      );

      dispatch(
        setLatestChanges({
          underRemoval: savedChangeObjects,
          unsaved: freshNewChangeObjects
        })
      );
      setState(assoc("changeObjects", nextChangeObjects, getState()));
    },
    showNewRestrictionDialog: () => ({getState, setState}) => {
      setState({...getState(), isRestrictionDialogVisible: true});
    },
  },
  name: "Muutokset"
});

const getChangeObjectsByKeyAndAnchor = (key, anchor, changeObjects = {}) => {
  return path(prepend(key, split("_", anchor)), changeObjects) || [];
};

const getAllChangeObjectsByKeyAnchor = (state, { anchor }) => {
  const { changeObjects } = state;
  return {
    saved: getChangeObjectsByKeyAndAnchor("saved", anchor, changeObjects),
    underRemoval: getChangeObjectsByKeyAndAnchor(
      "underRemoval",
      anchor,
      changeObjects
    ),
    unsaved: getChangeObjectsByKeyAndAnchor("unsaved", anchor, changeObjects)
  };
};

const getChangeObjectsByAnchorWithoutUnderRemoval = (state, { anchor }) => {
  const { changeObjects } = state;
  const saved = reject(
    isNil,
    flatten(
      values(getChangeObjectsByKeyAndAnchor("saved", anchor, changeObjects))
    )
  );
  const underRemoval = reject(
    isNil,
    flatten(
      values(
        getChangeObjectsByKeyAndAnchor("underRemoval", anchor, changeObjects)
      )
    )
  );
  const unsaved = reject(
    isNil,
    flatten(
      values(getChangeObjectsByKeyAndAnchor("unsaved", anchor, changeObjects))
    )
  );
  return difference(concat(saved, unsaved), underRemoval);
};

const getLatestChangesByAnchorByKey = (state, { anchor }) => {
  const { latestChanges } = state;
  return {
    underRemoval: getLatestChangesByAnchor(anchor, latestChanges.underRemoval),
    unsaved: getLatestChangesByAnchor(anchor, latestChanges.unsaved)
  };
};

export const useLomake = createHook(Store);

export const useLatestChanges = createHook(Store, {
  selector: state => state.latestChanges
});

export const useLatestChangesByAnchor = createHook(Store, {
  selector: getLatestChangesByAnchorByKey
});

export const useChangeObjectsByAnchor = createHook(Store, {
  selector: getAllChangeObjectsByKeyAnchor
});

export const useChangeObjectsByAnchorWithoutUnderRemoval = createHook(Store, {
  selector: getChangeObjectsByAnchorWithoutUnderRemoval
});

export const useChangeObjectsByMultipleAnchorsWithoutUnderRemoval = createHook(Store, {
  selector: (state, { anchors }) => {
   return mergeAll(map(anchor => {
      return {
        [anchor]: getChangeObjectsByAnchorWithoutUnderRemoval(state, {anchor})
      }
    }, anchors))
  }
});

export const useChangeObjects = createHook(Store);

export const useUnsavedChangeObjects = createHook(Store, {
  selector: state => state.changeObjects.unsaved
});

export const useUnderRemovalChangeObjects = createHook(Store, {
  selector: state => state.changeObjects.underRemoval
});

export const MuutoksetContainer = createContainer(Store, {
  onInit: () => ({ setState }, initialState) => {
    setState(initialState);
  }
});
