import {
  mapObjIndexed,
  groupBy,
  prop,
  head,
  omit,
  map,
  sort,
  endsWith,
  find,
  compose,
  propEq,
  filter,
  path,
  flatten,
  includes
} from "ramda";
import localforage from "localforage";

export const initializePOMuuEhto = ehto => {
  return omit(["koodiArvo"], {
    ...ehto,
    koodiarvo: ehto.koodiArvo,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), ehto.metadata))
  });
};

export const initializePOMuutEhdot = ehdot => {
  return sort(
    (a, b) => {
      const aInt = parseInt(a.koodiarvo, 10);
      const bInt = parseInt(b.koodiarvo, 10);
      if (aInt < bInt) {
        return -1;
      } else if (aInt > bInt) {
        return 1;
      }
      return 0;
    },
    map(ehto => {
      return initializePOMuuEhto(ehto);
    }, ehdot)
  );
};

export function getPOMuutEhdotFromStorage() {
  return localforage.getItem("poMuutEhdot");
}

export const defineBackendChangeObjects = async (
  changeObjects = [],
  maaraystyypit,
  locale,
  kohteet
) => {
  const kohde = find(
    propEq("tunniste", "muutkoulutuksenjarjestamiseenliittyvatehdot"),
    kohteet
  );
  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);
  const muutEhdot = await getPOMuutEhdotFromStorage();

  const muutokset = map(ehto => {
    // Checkbox-kenttien muutokset
    const checkboxChangeObj = find(
      compose(endsWith(`.${ehto.koodiarvo}.valintaelementti`), prop("anchor")),
      changeObjects
    );

    const isChecked = // (!!maarays && !checkboxChangeObj) ||
      checkboxChangeObj && checkboxChangeObj.properties.isChecked === true;

    let checkboxBEchangeObject = null;
    let kuvausBEchangeObjects = null;

    /**
     * Jos kuvauskenttiin liittyvä checkbox on ruksattu päälle,
     * lähetetään backendille kuvauskenttiin tehdyt muutokset.
     */
    if (isChecked) {
      // Kuvauskenttien muutokset kohdassa (muu ehto)
      const kuvausChangeObjects = filter(changeObj => {
        return (
          ehto.koodiarvo ===
            path(["metadata", "koodiarvo"], changeObj.properties) &&
          endsWith(".kuvaus", changeObj.anchor)
        );
      }, changeObjects);

      checkboxBEchangeObject = checkboxChangeObj
        ? {
            generatedId: `muuEhto-${Math.random()}`,
            kohde,
            koodiarvo: ehto.koodiarvo,
            koodisto: ehto.koodisto.koodistoUri,
            kuvaus: ehto.metadata[locale].kuvaus,
            maaraystyyppi,
            meta: {
              changeObjects: [checkboxChangeObj]
            },
            tila: checkboxChangeObj.properties.isChecked ? "LISAYS" : "POISTO"
          }
        : null;

      kuvausBEchangeObjects = map(changeObj => {
        return {
          generatedId: changeObj.anchor,
          kohde,
          koodiarvo: ehto.koodiarvo,
          koodisto: ehto.koodisto.koodistoUri,
          kuvaus: changeObj.properties.value,
          maaraystyyppi,
          meta: {
            ankkuri: path(["properties", "metadata", "ankkuri"], changeObj),
            kuvaus: changeObj.properties.value,
            changeObjects: [changeObj]
          },
          tila: "LISAYS"
        };
      }, kuvausChangeObjects);
    }

    return [checkboxBEchangeObject, kuvausBEchangeObjects];
  }, muutEhdot);

  /**
   * Lisätiedot-kenttä tulee voida tallentaa ilman, että osioon on tehty muita
   * muutoksia. Siksi kentän tiedoista luodaan tässä kohtaa oma backend-
   * muotoinen muutosobjekti.
   */
  const lisatiedotChangeObj = find(
    compose(includes(".lisatiedot."), prop("anchor")),
    changeObjects
  );

  const lisatiedotBEchangeObject = lisatiedotChangeObj
    ? {
        kohde,
        koodiarvo: path(
          ["properties", "metadata", "koodiarvo"],
          lisatiedotChangeObj
        ),
        koodisto: path(
          ["properties", "metadata", "koodisto", "koodistoUri"],
          lisatiedotChangeObj
        ),
        maaraystyyppi,
        meta: {
          arvo: path(["properties", "value"], lisatiedotChangeObj),
          changeObjects: [lisatiedotChangeObj]
        },
        tila: "LISAYS"
      }
    : null;

  return flatten([muutokset, lisatiedotBEchangeObject]).filter(Boolean);
};
