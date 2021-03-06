import { HAKEMUS_OTSIKOT } from "../../../../locales/uusiHakemusFormConstants";
import { getMessages } from "../../utils";

function kelpoisuusJaTyokokemusCategories(helpText, isReadOnly) {
  return [
    {
      anchor: `kelpoisuus-ja-tyokokemus-lakiteksti`,
      code: "!",
      title:
        "Valtioneuvoston asetuksen 434/2018 10 §:ssä on säädetty opettajien ja opetuksesta vastaavan johtajan pätevyydestä.",
      styleClasses: ["pl-6"]
    },
    {
      anchor: `kelpoisuus-ja-tyokokemus-info`,
      styleClasses: ["pl-6"],
      components: [
        {
          anchor: "A",
          name: "StatusTextRow",
          styleClasses: ["pt-4 text-base"],
          properties: {
            title: helpText
          }
        }
      ]
    },
    {
      anchor: "lupien-ja-tutkintojen-maarat",
      categories: [
        {
          anchor: "liikenneopettajalupa",
          styleClasses: ["pl-6"],
          components: [
            {
              anchor: "label",
              name: "StatusTextRow",
              styleClasses: ["pt-4 text-base"],
              properties: {
                title: "Liikenneopettajalupa (pakollinen)"
              }
            },
            {
              anchor: "lkm",
              name: "Input",
              properties: {
                fullWidth: true,
                isReadOnly,
                isRequired: true,
                placeholder: "Lukumäärä",
                type: "number",
                value: ""
              }
            }
          ]
        },
        {
          anchor: "kuorma-autonkuljettajan-ammattipatevyys",
          styleClasses: ["pl-6"],
          components: [
            {
              anchor: "label",
              name: "StatusTextRow",
              styleClasses: ["pt-4 text-base"],
              properties: {
                title: "Voimassa oleva kuorma-autonkuljettajan ammattipätevyys"
              }
            },
            {
              anchor: "lkm",
              name: "Input",
              properties: {
                fullWidth: true,
                isReadOnly,
                isRequired: true,
                placeholder: "Lukumäärä",
                type: "number",
                value: ""
              }
            }
          ]
        },
        {
          anchor: "linja-autonkuljettajan-ammattipatevyys",
          styleClasses: ["pl-6"],
          components: [
            {
              anchor: "label",
              name: "StatusTextRow",
              styleClasses: ["pt-4 text-base"],
              properties: {
                title: "Voimassa oleva linja-autonkuljettajan ammattipätevyys"
              }
            },
            {
              anchor: "lkm",
              name: "Input",
              properties: {
                fullWidth: true,
                isReadOnly,
                isRequired: true,
                placeholder: "Lukumäärä",
                type: "number",
                value: ""
              }
            }
          ]
        },
        {
          anchor: "vahintaan-1-vuoden-kokemus-a",
          title:
            "a) vähintään 1 vuoden kokemus johonkin seuraavista luokista kuuluvan ajoneuvon päätoimisena kuljettajana:",
          categories: [
            {
              anchor: "c-luokka",
              layout: { indentation: "none" },
              components: [
                {
                  anchor: "label",
                  name: "StatusTextRow",
                  styleClasses: ["pt-4 text-base"],
                  properties: {
                    title: "C-luokka"
                  }
                },
                {
                  anchor: "lkm",
                  name: "Input",
                  properties: {
                    fullWidth: true,
                    isReadOnly,
                    isRequired: true,
                    placeholder: "Lukumäärä",
                    type: "number",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "ce-luokka",
              layout: { indentation: "none" },
              components: [
                {
                  anchor: "label",
                  name: "StatusTextRow",
                  styleClasses: ["pt-4 text-base"],
                  properties: {
                    title: "CE-luokka"
                  }
                },
                {
                  anchor: "lkm",
                  name: "Input",
                  properties: {
                    fullWidth: true,
                    isReadOnly,
                    isRequired: true,
                    placeholder: "Lukumäärä",
                    type: "number",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "d-luokka",
              layout: { indentation: "none" },
              components: [
                {
                  anchor: "label",
                  name: "StatusTextRow",
                  styleClasses: ["pt-4 text-base"],
                  properties: {
                    title: "D-luokka"
                  }
                },
                {
                  anchor: "lkm",
                  name: "Input",
                  properties: {
                    fullWidth: true,
                    isReadOnly,
                    isRequired: true,
                    placeholder: "Lukumäärä",
                    type: "number",
                    value: ""
                  }
                }
              ]
            }
          ]
        },
        {
          anchor: "vahintaan-1-vuoden-kokemus-b",
          title: "b) jokin seuraavista tutkinnoista:",
          categories: [
            {
              anchor: "kuljetusalan-ammattitutkinto",
              layout: { indentation: "none" },
              components: [
                {
                  anchor: "label",
                  name: "StatusTextRow",
                  styleClasses: ["pt-4 text-base"],
                  properties: {
                    title: "Kuljetusalan ammattitutkinto"
                  }
                },
                {
                  anchor: "lkm",
                  name: "Input",
                  properties: {
                    fullWidth: true,
                    isReadOnly,
                    isRequired: true,
                    placeholder: "Lukumäärä",
                    type: "number",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "linja-autonkuljettajan-ammattitutkinto",
              layout: { indentation: "none" },
              components: [
                {
                  anchor: "label",
                  name: "StatusTextRow",
                  styleClasses: ["pt-4 text-base"],
                  properties: {
                    title: "Linja-autonkuljettajan ammattitutkinto"
                  }
                },
                {
                  anchor: "lkm",
                  name: "Input",
                  properties: {
                    fullWidth: true,
                    isReadOnly,
                    isRequired: true,
                    placeholder: "Lukumäärä",
                    type: "number",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "yhdistelma-ajoneuvonkuljettajan-ammattitutkinto",
              layout: { indentation: "none" },
              components: [
                {
                  anchor: "label",
                  name: "StatusTextRow",
                  styleClasses: ["pt-4 text-base"],
                  properties: {
                    title: "Yhdistelmäajoneuvonkuljettajan ammattitutkinto"
                  }
                },
                {
                  anchor: "lkm",
                  name: "Input",
                  properties: {
                    fullWidth: true,
                    isReadOnly,
                    isRequired: true,
                    placeholder: "Lukumäärä",
                    type: "number",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor: "puutavaran-autonkuljetuksen-ammattitutkinto",
              layout: { indentation: "none" },
              components: [
                {
                  anchor: "label",
                  name: "StatusTextRow",
                  styleClasses: ["pt-4 text-base"],
                  properties: {
                    title: "Puutavaran autonkuljetuksen ammattitutkinto"
                  }
                },
                {
                  anchor: "lkm",
                  name: "Input",
                  properties: {
                    fullWidth: true,
                    isReadOnly,
                    isRequired: true,
                    placeholder: "Lukumäärä",
                    type: "number",
                    value: ""
                  }
                }
              ]
            },
            {
              anchor:
                "kuljetuspalvelujen-osaamisalalla-suoritettu-logistiikan-perustutkinto",
              layout: { indentation: "none" },
              components: [
                {
                  anchor: "label",
                  name: "StatusTextRow",
                  styleClasses: ["pt-4 text-base"],
                  properties: {
                    title:
                      "Kuljetuspalvelujen osaamisalalla suoritettu logistiikan perustutkinto"
                  }
                },
                {
                  anchor: "lkm",
                  name: "Input",
                  properties: {
                    fullWidth: true,
                    isReadOnly,
                    isRequired: true,
                    placeholder: "Lukumäärä",
                    type: "number",
                    value: ""
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      anchor: "liitteet",
      title: "Liitteet",
      categories: [
        {
          anchor: "info",
          layout: { indentation: "none" },
          components: [
            {
              anchor: "A",
              name: "StatusTextRow",
              styleClasses: ["w-full"],
              properties: {
                title: HAKEMUS_OTSIKOT.LIITE_OHJE.FI,
                isHidden: isReadOnly
              }
            }
          ]
        },
        {
          anchor: "upload",
          layout: { indentation: "none" },
          components: [
            {
              anchor: "A",
              styleClasses: ["w-full"],
              name: "Attachments",
              messages: getMessages("attachments"),
              properties: {
                isReadOnly
              }
            }
          ]
        }
      ]
    }
  ];
}

export function tehtavanTarpeellisuus(orderCode, isReadOnly) {
  return {
    anchor: "tehtavan-tarpeellisuus",
    code: orderCode,
    title: "Tehtävän tarpeellisuus",
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    categories: [
      {
        anchor: "textbox",
        styleClasses: ["pl-6"],
        components: [
          {
            anchor: "A",
            name: "TextBox",
            properties: {
              isReadOnly,
              isRequired: true,
              title:
                "Perustelkaa tehtävän tarpeellisuus ensisijaisella toiminta-alueellanne",
              value: ""
            }
          }
        ]
      }
    ]
  };
}

export function voimassaOlo(orderCode, isReadOnly) {
  return {
    anchor: "voimassaolo",
    code: orderCode,
    title: "Lupa",
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    components: [
      {
        anchor: "title",
        name: "StatusTextRow",
        properties: {
          isRequired: true,
          title:
            "Onko hakijalla voimassa olevaa Liikenne- ja turvallisuusviraston (Trafi) myöntämää lupaa järjestää ammattipätevyyskoulutusta?"
        }
      }
    ],
    categories: [
      {
        anchor: "voimassaolo-field-no",
        styleClasses: ["pl-6"],
        components: [
          {
            anchor: "A",
            name: "RadioButtonWithLabel",
            properties: {
              isReadOnly,
              name: "voimassaolo-field-radio-no",
              code: 1,
              title: "Ei",
              labelStyles: {},
              isChecked: false,
              forChangeObject: {
                fieldName: "Ei"
              }
            }
          }
        ]
      },
      {
        anchor: "voimassaolo-field-yes",
        styleClasses: ["pl-6"],
        components: [
          {
            anchor: "A",
            name: "RadioButtonWithLabel",
            properties: {
              isReadOnly,
              name: "voimassaolo-field-radio-yes",
              code: 2,
              title: "Kyllä",
              labelStyles: {},
              isChecked: false,
              forChangeObject: {
                fieldName: "Kyllä"
              }
            }
          }
        ]
      }
    ]
  };
}

export function suunnitelma(orderCode, isReadOnly) {
  return {
    anchor: "suunnitelma",
    code: orderCode,
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    title: "Suunnitelma ammattipätevyyskoulutuksen järjestämiseksi",
    categories: [
      {
        anchor: "suunnitelma-field",
        styleClasses: ["pl-6"],
        components: [
          {
            anchor: "A",
            name: "TextBox",
            properties: {
              isReadOnly,
              isRequired: true,
              title:
                "Esittäkää toimintamalli ammattipätevyyskoulutuksen tiloista ja toteutuksesta",
              value: ""
            }
          }
        ]
      }
    ]
  };
}

export function osaaminen(orderCode, isReadOnly) {
  return {
    anchor: "osaaminen",
    code: orderCode,
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    title: "Koulutusohjelmien edellyttämä osaaminen",
    categories: [
      {
        anchor: "osaaminen-field",
        styleClasses: ["pl-6"],
        components: [
          {
            anchor: "A",
            name: "TextBox",
            properties: {
              isReadOnly,
              isRequired: true,
              title:
                "Selvitys henkilöstön osaamisesta koulutusohjelman järjestämiseksi",
              value: ""
            }
          }
        ]
      }
    ]
  };
}

export function johtaja(orderCode, isReadOnly) {
  return {
    anchor: "johtaja",
    code: orderCode,
    title:
      "Opetuksesta vastaavan johtajan tai johtajien kelpoisuus ja työkokemus",
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    categories: [
      {
        anchor: `johtaja-info`,
        components: [
          {
            anchor: "A",
            name: "TextBox",
            properties: {
              isReadOnly,
              isRequired: true,
              placeholder: "Sana on vapaa...",
              title:
                "! Valtioneuvoston asetuksen 434/2018 10 §:ssä on säädetty opettajien ja opetuksesta vastaavan johtajan pätevyydestä.",
              value: ""
            }
          }
        ]
      },
      {
        anchor: "liitteet",
        title: "Liitteet",
        categories: [
          {
            anchor: "info",
            layout: { indentation: "none" },
            components: [
              {
                anchor: "A",
                name: "StatusTextRow",
                styleClasses: ["w-full"],
                properties: {
                  title: `Hakemukseen tulee liittää selvitys opetuksesta vastaavan johtajan tai johtajien kelpoisuudesta ja työkokemuksesta
                  toimipisteittäin. Lisäksi tulee toimittaa selvitys siitä, että koulutuksen järjestäjällä on opetuksesta vastaavan
                  johtajan tai vastaavien johtajien tehtävä (VNAsetus 434/2018, 10§, 12§ 1 mom 3 kohta). Merkitse liite
                  salassapidettäväksi, mikäli se sisältää henkilötietoja. Liitteiden nimet eivät myöskään saa sisältää henkilötietoa.`,
                  isHidden: isReadOnly
                }
              }
            ]
          },
          {
            anchor: "upload",
            layout: { indentation: "none" },
            components: [
              {
                anchor: "A",
                styleClasses: ["w-full"],
                name: "Attachments",
                messages: getMessages("attachments"),
                properties: {
                  isReadOnly
                }
              }
            ]
          }
        ]
      }
    ]
  };
}

export function johtajienKelpoisuusJaTyokokemus(
  orderCode,
  helpText,
  isReadOnly
) {
  return {
    anchor: "johtajien-kelpoisuus-ja-tyokokemus",
    code: orderCode,
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    title:
      "Opetuksesta vastaavan johtajan tai johtajien kelpoisuus ja työkokemus",
    categories: kelpoisuusJaTyokokemusCategories(helpText, isReadOnly)
  };
}

export function opettajien(orderCode, helpText, isReadOnly) {
  return {
    anchor: "opettajien-kelpoisuus-ja-tyokokemus",
    code: orderCode,
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    title: "Opettajien kelpoisuus ja työkokemus",
    categories: kelpoisuusJaTyokokemusCategories(helpText, isReadOnly)
  };
}

export function ajoneuvoKanta(orderCode, isReadOnly) {
  return {
    anchor: "ajoneuvokanta",
    code: orderCode,
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    title: "Ajoneuvokanta",
    categories: [
      {
        anchor: `ajoneuvokanta-kentat`,
        styleClasses: ["pl-6"],
        title:
          "Selvitys opetuksessa käytettävästä ajoneuvokannasta ja opetusvälineistä ja niiden soveltuvuudesta ammattipätevyyskoulutukseen.",

        components: [
          {
            anchor: "linja-autoja",
            name: "Input",
            styleClasses: ["mt-6"],
            properties: {
              fullWidth: true,
              isReadOnly,
              isRequired: true,
              label: "Linja-autoja",
              placeholder: "Linja-autoja",
              type: "number",
              value: ""
            }
          },
          {
            anchor: "kuorma-autoja",
            name: "Input",
            styleClasses: ["mt-6"],
            properties: {
              fullWidth: true,
              isReadOnly,
              isRequired: true,
              label: "Kuorma-autoja",
              placeholder: "Kuorma-autoja",
              type: "number",
              value: ""
            }
          },
          {
            anchor: "peravaunuja",
            name: "Input",
            styleClasses: ["mt-6"],
            properties: {
              fullWidth: true,
              isReadOnly,
              isRequired: true,
              label: "Perävaunuja",
              placeholder: "Perävaunuja",
              type: "number",
              value: ""
            }
          },
          {
            anchor: "muut-ajoneuvot",
            name: "Input",
            styleClasses: ["mt-6"],
            properties: {
              fullWidth: true,
              isReadOnly,
              isRequired: true,
              label: "Muut ajoneuvot",
              placeholder: "Muut ajoneuvot",
              type: "number",
              value: ""
            }
          }
        ]
      },
      {
        anchor: "liitteet",
        title: "Liitteet",
        categories: [
          {
            anchor: "info",
            layout: { indentation: "none" },
            components: [
              {
                anchor: "A",
                name: "StatusTextRow",
                styleClasses: ["w-full"],
                properties: {
                  title: HAKEMUS_OTSIKOT.LIITE_OHJE.FI,
                  isHidden: isReadOnly
                }
              }
            ]
          },
          {
            anchor: "upload",
            layout: { indentation: "none" },
            components: [
              {
                anchor: "A",
                styleClasses: ["w-full"],
                name: "Attachments",
                messages: getMessages("attachments"),
                properties: {
                  isReadOnly
                }
              }
            ]
          }
        ]
      }
    ]
  };
}

export function muutOpetusvalineet(orderCode, isReadOnly) {
  return {
    anchor: "muut-opetusvalineet",
    code: orderCode,
    styleClasses: ["border-t px-4 py-8 hover:bg-gray-100"],
    title: "Muut opetusvälineet",
    categories: [
      {
        anchor: `asetuksen-mukaiset`,
        styleClasses: ["pl-6"],
        components: [
          {
            anchor: "A",
            name: "TextBox",
            properties: {
              isReadOnly,
              isRequired: true,
              title:
                "! Asetuksen mukaiset opetus- ja havaintovälineet (VnAsetus 434/2018, 11 § 1 ja 2 mom.)",
              value: ""
            }
          }
        ]
      },
      {
        anchor: "muut",
        styleClasses: ["pl-6"],
        components: [
          {
            anchor: "B",
            name: "TextBox",
            properties: {
              isReadOnly,
              isRequired: true,
              labelStyles: {},
              placeholder:
                "Muut oppilaitoksen oppimisympäristöissä tapahtuvaan osaamisen hankkimiseen liittyvät välineet",
              title: "Muut opetus- ja havaintovälineet",
              value: ""
            }
          }
        ]
      }
    ]
  };
}
