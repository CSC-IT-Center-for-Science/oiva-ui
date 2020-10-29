import moment from "moment";
import * as tutkinnotHelper from "../../../helpers/tutkinnot/";
import * as toimintaalueHelper from "../../../helpers/toiminta-alue/";
import * as opiskelijavuodetHelper from "../../../helpers/opiskelijavuodet";
import * as muutHelper from "../../../helpers/muut";
import * as kieletHelper from "../../../helpers/kielet";
import * as koulutuksetHelper from "../../../helpers/koulutukset";
import * as R from "ramda";

export async function createObjectToSave(
  locale,
  organisation,
  lupa,
  changeObjects,
  uuid,
  kohteet,
  maaraystyypit,
  muut,
  lupaKohteet
) {
  // TUTKINNOT, OSAAMISALAT JA TUKINTOKIELET
  //   const tutkinnot = await tutkinnotHelper.defineBackendChangeObjects(
  //     {
  //       tutkinnotJaOsaamisalat: {
  //         muutokset: R.flatten(R.values(changeObjects.tutkinnot)),
  //         perustelut: changeObjects.perustelut
  //           ? R.flatten(R.values(changeObjects.perustelut.tutkinnot))
  //           : []
  //       },
  //       tutkintokielet: {
  //         muutokset: R.flatten(
  //           R.values(R.path(["kielet", "tutkintokielet"], changeObjects))
  //         ),
  //         perustelut: R.flatten(
  //           R.values(
  //             R.path(["perustelut", "kielet", "tutkintokielet"], changeObjects)
  //           )
  //         )
  //       }
  //     },
  //     R.find(R.propEq("tunniste", "tutkinnotjakoulutukset"), kohteet),
  //     R.find(R.propEq("tunniste", "opetusjatutkintokieli"), kohteet),
  //     maaraystyypit,
  //     locale
  //   );

  // TOIMINTA-ALUE
  //   const categoryFilterChangeObj =
  //     R.find(
  //       R.propEq("anchor", "categoryFilter"),
  //       changeObjects.toimintaalue || []
  //     ) || {};
  //   const toimintaalue = await toimintaalueHelper.defineBackendChangeObjects(
  //     {
  //       quickFilterChanges: R.path(
  //         ["properties", "quickFilterChanges"],
  //         categoryFilterChangeObj
  //       ),
  //       changesByProvince: R.path(
  //         ["properties", "changesByProvince"],
  //         categoryFilterChangeObj
  //       ),
  //       perustelut: (() => {
  //         // There is only one field for reasoning and it must be used as a source
  //         // for the actual change objects.
  //         const sourceObject = (R.path(
  //           ["perustelut", "toimintaalue"],
  //           changeObjects
  //         ) || [])[0];
  //         /**
  //          * Next step is to go through all the Toiminta-alue related "change objects" of the first
  //          * page of the wizard and generate change objects based on them.
  //          */
  //         return !!sourceObject
  //           ? R.map(changeObject => {
  //               return {
  //                 anchor: `perustelut_toimintaalue`,
  //                 properties: sourceObject.properties
  //               };
  //             }, R.path(["toimintaalue"], changeObjects) || [])
  //           : [];
  //       })()
  //     },
  //     R.find(R.propEq("tunniste", "toimintaalue"), kohteet),
  //     maaraystyypit,
  //     lupa.maaraykset
  //   );

  // KOULUTUKSET
  //   const koulutukset = koulutuksetHelper.getChangesToSave(
  //     {
  //       muutokset: R.compose(
  //         R.flatten,
  //         R.values
  //       )(R.values(R.path(["koulutukset"], changeObjects))),
  //       perustelut: R.compose(
  //         R.filter(R.compose(R.not, R.isEmpty)),
  //         R.flatten,
  //         R.values
  //       )(R.values(R.path(["perustelut", "koulutukset"], changeObjects)))
  //     },
  //     R.find(R.propEq("tunniste", "tutkinnotjakoulutukset"), kohteet),
  //     maaraystyypit,
  //     locale
  //   );

  // OPETUSKIELET
  //   const opetuskielet = kieletHelper.getChangesToSave(
  //     {
  //       muutokset: R.compose(
  //         R.flatten,
  //         R.values
  //       )(R.values(R.path(["kielet", "opetuskielet"], changeObjects))),
  //       perustelut: R.compose(
  //         R.flatten,
  //         R.values
  //       )(
  //         R.values(
  //           R.path(["perustelut", "kielet", "opetuskielet"], changeObjects)
  //         )
  //       )
  //     },
  //     R.find(R.propEq("tunniste", "opetusjatutkintokieli"), kohteet),
  //     maaraystyypit
  //   );

  // OPISKELIJAVUODET
  const opiskelijavuodet = opiskelijavuodetHelper.createBackendChangeObjects(
    {
      muutokset: changeObjects.opiskelijavuodet,
      perustelut: [] // Esittelijän ei tarvitse perustella tekemiään muutoksia
    },
    R.find(R.propEq("tunniste", "opiskelijavuodet"), kohteet),
    maaraystyypit,
    muut,
    lupaKohteet,
    R.compose(R.flatten, R.values)(R.values(R.path(["muut"], changeObjects)))
  );

  // MUUT
  //   const muutMuutokset = muutHelper.getChangesToSave(
  //     {
  //       muutokset: R.compose(
  //         R.flatten,
  //         R.values
  //       )(R.values(R.path(["muut"], changeObjects))),
  //       perustelut: R.compose(
  //         R.flatten,
  //         R.values
  //       )(R.values(R.path(["perustelut", "muut"], changeObjects)))
  //     },
  //     R.find(R.propEq("tunniste", "muut"), kohteet),
  //     maaraystyypit
  //   );

  let objectToSave = {
    alkupera: "ESITTELIJA",
    diaarinumero: lupa.diaarinumero,
    jarjestajaOid: organisation.oid,
    jarjestajaYtunnus: organisation.ytunnus,
    luoja: sessionStorage.getItem("username"),
    luontipvm: moment().format("YYYY-MM-DD"),
    lupaUuid: lupa.uuid,
    tila: uuid ? "VALMISTELUSSA" : "LUONNOS",
    paivittaja: "string",
    paivityspvm: null,
    voimassaalkupvm: null,
    voimassaloppupvm: null, // TODO: find the correct value somehow,
    liitteet: [], // allAttachments,
    meta: {},
    muutokset: R.flatten([
      //   tutkinnot,
      //   koulutukset,
      //   opetuskielet,
      //   toimintaalue,
      opiskelijavuodet
      //   muutMuutokset
    ]),
    uuid
  };

  const asianumeroObj = R.find(
    R.propEq("anchor", "topthree.asianumero.A"),
    changeObjects.topthree || []
  );
  objectToSave.asianumero = asianumeroObj ? asianumeroObj.properties.value : "";
  const paatospaivaObj = R.find(
    R.propEq("anchor", "topthree.paatospaiva.A"),
    changeObjects.topthree || []
  );
  objectToSave.paatospvm = paatospaivaObj
    ? moment(paatospaivaObj.properties.value).format("YYYY-MM-DD")
    : "";
  const voimaantulopaivaObj = R.find(
    R.propEq("anchor", "topthree.voimaantulopaiva.A"),
    changeObjects.topthree || []
  );
  objectToSave.voimassaalkupvm = voimaantulopaivaObj
    ? moment(voimaantulopaivaObj.properties.value).format("YYYY-MM-DD")
    : "";
  // This helps the frontend to initialize the first three fields on form load.
  objectToSave.meta.topthree = changeObjects.topthree;

  console.info(objectToSave);

  return objectToSave;
}
