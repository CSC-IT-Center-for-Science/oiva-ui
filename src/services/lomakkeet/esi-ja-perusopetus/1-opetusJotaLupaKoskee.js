import { isAdded, isInLupa, isRemoved } from "css/label";
import { find, flatten, map, pathEq, propEq } from "ramda";
import { getOpetustehtavatFromStorage } from "../../../helpers/opetustehtavat";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { __ } from "i18n-for-browser";
import { getLocalizedProperty } from "../utils";

export async function opetusJotaLupaKoskee(
  { maaraykset },
  { isPreviewModeOn, isReadOnly },
  locale
) {
  const _isReadOnly = isReadOnly || isPreviewModeOn;
  const lisatiedot = await getLisatiedotFromStorage();
  const opetustehtavat = await getOpetustehtavatFromStorage();

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );

  const lisatietomaarays = find(propEq("koodisto", "lisatietoja"), maaraykset);

  return flatten([
    map(opetustehtava => {
      const maarays = find(
        m =>
          propEq("koodiarvo", opetustehtava.koodiarvo, m) &&
          propEq("koodisto", "opetustehtava", m),
        maaraykset
      );
      return {
        anchor: "opetustehtava",
        components: [
          {
            anchor: opetustehtava.koodiarvo,
            name: "CheckboxWithLabel",
            styleClasses: isPreviewModeOn ? ["pl-4"] : [],
            properties: {
              title: getLocalizedProperty(
                opetustehtava.metadata,
                locale,
                "nimi"
              ),
              labelStyles: {
                addition: isAdded,
                removal: isRemoved,
                custom: Object.assign({}, !!maarays ? isInLupa : {})
              },
              isChecked: !!maarays,
              isIndeterminate: false,
              isPreviewModeOn,
              isReadOnly: _isReadOnly
            }
          }
        ]
      };
    }, opetustehtavat),
    lisatiedotObj
      ? [
          {
            anchor: "opetus",
            layout: { margins: { top: "large" } },
            styleClasses: ["mt-10", "pt-10", "border-t"],
            components: [
              {
                anchor: "lisatiedot-info",
                name: "StatusTextRow",
                properties: {
                  title: __("common.lisatiedotInfo")
                }
              }
            ]
          },
          {
            anchor: "lisatiedot",
            components: [
              {
                anchor: lisatiedotObj.koodiarvo,
                name: "TextBox",
                properties: {
                  isPreviewModeOn,
                  isReadOnly: _isReadOnly,
                  title: __("common.lisatiedot"),
                  value: lisatietomaarays ? lisatietomaarays.meta.arvo : ""
                }
              }
            ]
          }
        ]
      : null
  ]).filter(Boolean);
}
