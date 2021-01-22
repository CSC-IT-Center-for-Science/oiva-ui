import {
  append,
  endsWith,
  filter,
  find,
  flatten,
  map,
  nth,
  pathEq,
  prop,
  split,
  startsWith
} from "ramda";
import { removeAnchorPart } from "utils/common";

export const previewOfMuutEhdot = ({ lomakedata }) => {
  let structure = [];

  const checkedNodes = filter(
    pathEq(["properties", "isChecked"], true),
    lomakedata
  );

  const anchorsOfCheckedNodes = map(prop("anchor"), checkedNodes);

  if (anchorsOfCheckedNodes.length) {
    /**
     * Yhtä checkbox-valintaa kohden voi olla useita kuvauksia. Etsitään ne.
     */
    const kuvausNodes = flatten(
      map(anchor => {
        const anchorRelatedDescriptionNodes = filter(node => {
          return (
            startsWith(`${removeAnchorPart(anchor, 2)}.`, node.anchor) &&
            endsWith(".kuvaus", node.anchor)
          );
        }, lomakedata);
        return anchorRelatedDescriptionNodes;
      }, anchorsOfCheckedNodes).filter(Boolean)
    );

    if (kuvausNodes.length) {
      structure = append(
        {
          anchor: "valittu",
          components: [
            {
              anchor: "A",
              name: "List",
              properties: {
                items: map(node => {
                  console.info("node", node);
                  const anchorParts = split(".", node.anchor);
                  return {
                    anchor: nth(1, anchorParts),
                    components: [
                      {
                        anchor: nth(2, anchorParts),
                        name: "HtmlContent",
                        properties: { content: node.properties.value }
                      }
                    ]
                  };
                }, kuvausNodes)
              }
            }
          ]
        },
        structure
      );
    }
  }

  const lisatiedotNode = find(
    // 1 = koodiston koodiarvo
    node => endsWith(".lisatiedot.1", node.anchor),
    lomakedata
  );

  if (lisatiedotNode && lisatiedotNode.properties.value) {
    structure = append(
      {
        anchor: "lisatiedot",
        components: [
          {
            anchor: "A",
            name: "StatusTextRow",
            properties: {
              title: lisatiedotNode.properties.value
            }
          }
        ]
      },
      structure
    );
  }

  return structure;
};
