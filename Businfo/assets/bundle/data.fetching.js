var cities = [
  {
    name: 'Jaipur',
    code: "JPR",
  },
  {
    name: 'AGRA',
    code: 'AGR'
  },
  {
    name: "Ajmer",
    code: "AJMR"
  },
  {
    name: 'Ajmer Road',
    code: "AJMR"
  }
]

var bus_data = [
  {
    vendor: "Asam raodways",
    from: "Kota",
    to: "Jaipur",
    stops: [
      { name: "Chambal", timings: ["08:00", "12:00"] , distance:"0"},
      { name: "Dausa", timings: ["09:00", "01:00"] },
      { name: "Mansarovar", timings: ["10:00", "02:00"] },
      { name: "Bassi", timings: ["10:30", "02:30"] }
    ],
    timings: ["08:00", "14:00"],
    route: "MAngole ",
    handler: 'ajmer'
  },
  {
    vendor: "",
    from: "Jaipur",
    to: "Ajmer",
    stops: [
      { name: "Ajmer Road", timings: ["10:00", "03:00"] },
      { name: "Beawar", timings: ["11:00", "04:00"] },
      { name: "Kishangarh", timings: ["12:00", "05:00"] }
    ],
    timings: ["10:30", "15:30"]
  },
  {
    from: "Ajmer",
    to: "Udaipur",
    stops: [
      { name: "Kishangarh", timings: ["12:00", "05:00"] },
      { name: "Neemuch", timings: ["01:00", "06:00"] },
      { name: "Chittorgarh", timings: ["02:00", "07:00"] }
    ],
    timings: ["12:30", "18:30"]
  },
  {
    from: "Udaipur",
    to: "Jodhpur",
    stops: [
      { name: "Kankroli", timings: ["09:00", "01:00"] },
      { name: "Nathdwara", timings: ["10:00", "02:00"] },
      { name: "Rajsamand", timings: ["11:00", "03:00"] }
    ],
    timings: ["09:30", "15:30"]
  },
  {
    from: "Jodhpur",
    to: "Bikaner",
    stops: [
      { name: "Osian", timings: ["10:00", "03:00"] },
      { name: "Phalodi", timings: ["11:00", "04:00"] },
      { name: "Nokha", timings: ["12:00", "05:00"] }
    ],
    timings: ["10:30", "16:30"]
  },
  {
    from: "Bikaner",
    to: "Churu",
    stops: [
      { name: "Nokha", timings: ["12:00", "05:00"] },
      { name: "Rajgarh", timings: ["01:00", "06:00"] },
      { name: "Sardarshahar", timings: ["02:00", "07:00"] }
    ],
    timings: ["12:30", "18:30"]
  },
  {
    from: "Churu",
    to: "Sikar",
    stops: [
      { name: "Jaswantgarh", timings: ["02:00", "07:00"] },
      { name: "Danta Ramgarh", timings: ["03:00", "08:00"] },
      { name: "Ratangarh", timings: ["04:00", "09:00"] }
    ],
    timings: ["02:30", "09:00"]
  },
  {
    from: "Sikar",
    to: "Jaipur",
    stops: [
      { name: "Fatehpur", timings: ["09:00", "01:00"] },
      { name: "Bissau", timings: ["10:00", "02:00"] },
      { name: "Chirawa", timings: ["11:00", "03:00"] }
    ],
    timings: ["09:30", "15:30"]
  },
  {
    from: "Jaipur",
    to: "Kota",
    stops: [
      { name: "Bassi", timings: ["08:00", "12:00"] },
      { name: "Sanganer", timings: ["09:00", "01:00"] },
      { name: "Malpura", timings: ["10:00", "02:00"] }
    ],
    timings: ["08:30", "14:30"]
  },
  {
    from: "Jaipur",
    to: "Ajmer",
    stops: [
      { name: "Mansingh Road", timings: ["09:30", "01:30"] },
      { name: "Amer", timings: ["10:30", "02:30"] },
      { name: "Madhosh", timings: ["11:30", "03:30"] }
    ],
    timings: ["09:00", "15:00"]
  },
  {
    from: "Ajmer",
    to: "Pushkar",
    stops: [
      { name: "Beawar", timings: ["12:00", "05:00"] },
      { name: "Kishangarh", timings: ["01:00", "06:00"] },
      { name: "Pahadi", timings: ["02:00", "07:00"] }
    ],
    timings: ["12:30", "18:30"]
  },
  {
    from: "Pushkar",
    to: "Ajmer",
    stops: [
      { name: "Brahma Temple", timings: ["09:00", "01:00"] },
      { name: "Pushkar Lake", timings: ["10:00", "02:00"] },
      { name: "Savitri Temple", timings: ["11:00", "03:00"] }
    ],
    timings: ["09:30", "15:30"]
  },
  {
    from: "Jaipur",
    to: "Jaisalmer",
    stops: [
      { name: "Ajmer", timings: ["08:00", "12:00"] },
      { name: "Pali", timings: ["09:30", "01:30"] },
      { name: "Osian", timings: ["10:30", "02:30"] }
    ],
    timings: ["08:30", "14:30"]
  },
  {
    from: "Jaisalmer",
    to: "Bikaner",
    stops: [
      { name: "Ramgarh", timings: ["09:00", "01:00"] },
      { name: "Kolayat", timings: ["10:00", "02:00"] },
      { name: "Deshnok", timings: ["11:00", "03:00"] }
    ],
    timings: ["09:30", "15:30"]
  },
  {
    from: "Bikaner",
    to: "Jodhpur",
    stops: [
      { name: "Phalodi", timings: ["08:00", "12:00"] },
      { name: "Osian", timings: ["09:00", "01:00"] },
      { name: "Luni", timings: ["10:00", "02:00"] }
    ],
    timings: ["08:30", "14:30"]
  },
  {
    from: "Jodhpur",
    to: "Jaisalmer",
    stops: [
      { name: "Osian", timings: ["11:00", "03:00"] },
      { name: "Balesar", timings: ["12:00", "04:00"] },
      { name: "Pokhran", timings: ["01:00", "05:00"] }
    ],
    timings: ["11:30", "17:30"]
  },
  {
    from: "Udaipur",
    to: "Kota",
    stops: [
      { name: "Nathdwara", timings: ["08:00", "12:00"] },
      { name: "Rajsamand", timings: ["09:00", "01:00"] },
      { name: "Kankroli", timings: ["10:00", "02:00"] }
    ],
    timings: ["08:30", "14:30"]
  },
  {
    from: "Kota",
    to: "Sikar",
    stops: [
      { name: "Bhadra", timings: ["11:00", "03:00"] },
      { name: "Mokhampura", timings: ["12:00", "04:00"] },
      { name: "Chirawa", timings: ["01:00", "05:00"] }
    ],
    timings: ["11:30", "17:30"]
  },
  {
    from: "Sikar",
    to: "Churu",
    stops: [
      { name: "Fatehpur", timings: ["09:00", "01:00"] },
      { name: "Ratangarh", timings: ["10:00", "02:00"] },
      { name: "Sadulpur", timings: ["11:00", "03:00"] }
    ],
    timings: ["09:30", "15:30"]
  }
];