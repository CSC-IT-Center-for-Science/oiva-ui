import { isAdded, isInLupa, isRemoved } from "css/label";
import { map } from "ramda";

/**
 * Ammatillinen koulutus - Esittelijän lomakenäkymä - Osio 5 - Selvitykset.
 * @param {*} data
 * @param {*} isReadOnly
 * @param {*} locale
 */
export function getMuutSelvitykset(
  { items, maarayksetByKoodiarvo },
  isReadOnly,
  locale
) {
  const localeUpper = locale.toUpperCase();
  return map(item => {
    const hasMaarays = !!maarayksetByKoodiarvo[item.koodiarvo];
    return {
      anchor: item.koodiarvo,
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            isChecked: !!hasMaarays,
            isReadOnly,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved,
              custom: !!hasMaarays ? isInLupa : {}
            },
            title:
              item.metadata[localeUpper].kuvaus ||
              item.metadata[localeUpper].nimi
          }
        }
      ]
    };
  }, items);
}