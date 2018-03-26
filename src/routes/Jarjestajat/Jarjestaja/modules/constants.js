export const LUPA_SECTIONS = {
  1: {
    heading: "Tutkinnot ja koulutukset",
    tunniste: 'tutkinnotjakoulutukset',
    headingNumber: 1
  },
  2: {
    heading: "Opetus- ja tutkintokielet",
    tunniste: 'opetusjatutkintokieli',
    headingNumber: 2
  },
  3: {
    heading: "Toiminta-alueet",
    tunniste: 'toimintaalue',
    headingNumber: 3
  },
  4: {
    heading: "Opiskelijavuodet",
    tunniste: 'opiskelijavuodet',
    headingNumber: 4
  },
  5: {
    heading: "Muut oikeudet, velvollisuudet, ehdot ja tehtävät",
    tunniste: 'muut',
    headingNumber: 5
  }
}

export const KOHTEET = {
  TUTKINNOT: 'tutkinnotjakoulutukset',
  KIELI: 'opetusjatutkintokieli',
  TOIMIALUE: 'toimintaalue',
  OPISKELIJAVUODET: 'opiskelijavuodet',
  MUUT: 'muut'
}

export const KOODISTOT = {
  KOULUTUS: 'koulutus',
  OIVA_TYOVOIMAKOULUTUS: 'oivatyovoimakoulutus',
  TEHTAVAAN_VALMISTAVA_KOULUTUS: 'tehtavaanvalmistavakoulutus',
  AMMATILLISEEN_TEHTAVAAN_VALMISTAVA_KOULUTUS: 'ammatilliseentehtavaanvalmistavakoulutus',
  KULJETTAJAKOULUTUS: 'kuljettajakoulutus',
  OSAAMISALA: 'osaamisala'
}

export const LUPA_TEKSTIT = {
  TOIMINTA_ALUE : {
    VELVOLLISUUS_YKSIKKO: {
      FI: 'Koulutuksen järjestäjällä on velvollisuus järjestää tutkintoja ja koulutusta ensisijaisesti seuraavan maakunnan osaamis- ja koulutustarpeeseen'
    },
    VELVOLLISUUS_MONIKKO: {
      FI: 'Koulutuksen järjestäjällä on velvollisuus järjestää tutkintoja ja koulutusta ensisijaisesti seuraavien maakuntien osaamis- ja koulutustarpeisiin'
    }
  },
  KIELI: {
    VELVOLLISUUS_YKSIKKO: {
      FI: 'Koulutuksen järjestäjän on annettava opetusta seuraavalla opetuskielellä',
      SV: 'Utbildningsanordnaren ska meddela undervisningen på följande språk'
    },
    VELVOLLISUUS_MONIKKO: {
      FI: 'Koulutuksen järjestäjän on annettava opetusta seuraavialla opetuskielillä'
    },
    LISA_RUOTSI: {
      FI: 'Tutkintokieli on em. opetuskielen lisäksi ruotsi seuraavissa tutkinnoissa'
    }
  }
}

export const TUTKINTO_TEKSTIT = {
  otsikkoKaikkiLuvat: {
      FI: 'Koulutuksen järjestäjällä on oikeus myöntää seuraavia tutkintoja ja antaa niihin tutkintokoulutusta:',
      SV: 'Utbildningsanordnaren har rätt att utfärda följande examina och att ge examensutbildning för dem:'
  },
  otsikkoTaydentava: {
      FI: 'Koulutuksen järjestäjä voi järjestää myös em. tutkintoihin liittyvää ammatillisesta koulutuksesta annetun lain\n' +
          ' (531/2017) 8 §:n 1 kohdassa tarkoitettua ammatillista osaamista syventävää tai täydentävää koulutusta.',
      SV: 'l anknytning till ovannämnda examina kan utbildningsanordnaren också ordna sådan utbildning som fördjupar\n' +
          ' eller kompletterar yrkeskompetensen som avses i 8 § 1 punkten i lagen om yrkesutbildning (531/2017).'
  },
  valma: {
    selite: 'Koulutuksen järjestäjällä on oikeus järjestää seuraavaa valmentavaa koulutusta'
  },
  telma: {
    selite: 'Koulutuksen järjestäjällä on oikeus järjestää seuraavaa valmentavaa koulutusta'
  },
  ammatilliseentehtavaanvalmistavakoulutus: {
    selite: 'Koulutuksen järjestäjällä on oikeus järjestää seuraavaa ammatilliseen tehtävään valmistavaa koulutusta',
  },
}

export const LUPA_VOIMASSAOLO_20181231_ASTI =
    ["384301","354301","364308","324101","334117","354401","364304","334115","364201","364901",
    "354111","384101","354201","354212","355411","374117","324130","334118","374123","355502",
    "354409","354103","354104","354801","354403","374124","324107","354602","354115","354205",
    "324128","354114","354605","354605","324109","374118","354802","355410","354116","354702",
    "384204","354106","324110","354404","354803","354311","334104","384111","364109","364301",
    "364301","364305","364302","355905","354603","334105","355402","354206","374121","374114",
    "374114","354207","354710","354710","354107","355903","384109","324115","324116","354705",
    "364106","324119","334106","324129","324120","384108","354405","354407","334114","384106",
    "354209","324126","384113","354804","354211","364102","355407","355906","354112","334102",
    "355413","384205","354109","354709","355212","364202","364205","364107","364204","334111",
    "374113","355902","427101","437108","457301","457302","457401","457304","487101","467201",
    "467904","457101","487304","457201","458410","427130","437101","487303","437102","458502",
    "457102","457103","458503","477106","427107","457109","457207","427128","457111","427109",
    "487401","457803","458408","457702","457104","457303","487201","457105","457802","467102",
    "437110","467302","457603","458409","457205","457801","457206","457709","467304","458204",
    "457110","458207","427114","427115","437104","457705","427118","427119","457404","437109",
    "467101","458901","458411","487106","458405","457106","437106","458412","457108","457306",
    "457708","437111","467203","477107","437107","334109"]


export const LUPA_VOIMASSAOLO_20180731_ASTI =
 ["354315","354302","354307","334101","355505","355104","364904","354312","364401","364402",
    "364403","354202","355101","355108","355102","355103","355110","355106","364906","355107",
    "355109","354309","354310","354314","384203","355901","354406","324301","334108","364203",
    "354408","457305","457203","477108","458101","458102","467901","467301","477109","467902",
    "457403","477110","427301","457406","381303","381112","381304","351106","381113","321301",
    "321101","381204","352902","381201","351701","352401","351704","321901","351204",
    "321603"]

export const LUPA_VOIMASSAOLO_20180801_LUKIEN =
 ["355146","354345","355145","364946","364445","354446","384247","457441","477143","458141",
    "467942","381142","321141","381141","381241","351741","352441","381342",
    "321604"]

export const LUPA_VOIMASSAOLO_20190101_LUKIEN =
 ["354645","364245","324146","334145","354445","364345","354146","384146","354245","355445",
    "374147","355645","354845","384246","354745","384248","364146","384148","384147","437141",
    "355945","427141","457341","457442","484147","467241","458641","487341","457241","458441",
    "437142","457141","487241","437143","457841","457741","487244","467141","467342","484446",
    "458241","467441"]
