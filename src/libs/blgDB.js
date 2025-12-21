export const buildingDB=[
  {
    _id: 1,
    projectTitle: "G-North",
    siteSection: "featured",
    area: "2000",
    buildingTitle: "3 bedrooed house",
    buildingType: "single-storey",
    desc: "The brief was to come with a cozy 4 bedroom house with a guest room attached. It also had to have a pajama lounge for the viewing television as well as a separate formal lounge which would be used to entertain quests. The design needed to be trendy but understated. It need to sophisticated enough but affordable to build",
    buildingSummary: {
      "area": "235",
      "beds": "4",
      "level": "1",
      "baths": "3",
      "cars": "2"
    },
    features: "FEATURES: 4 Bedrooms, a Guest Bedroom, Breakfast - nook, Pajama-lounge, Scullery, formal dining, Office space, outdoor seating and entertainment area, and an airy kitchen",
    outroSection: "The design celebrates the life style of the client and as occurred as the plot was the challenge was truly inspirational",
    buildingHighlights: [
      {
        "id": 0,
        "title": "PLAN DIMENSIONS",
        "desc": "235M2 Area: 16.56m X 23.69m,Height: 5.6m"
      },
      {
        "id": 1,
        "title": "CEILING HEIGHTS",
        "desc": "2.7meters"
      },
      {
        "id": 2,
        "title": "SQUARE FOOTAGE BREAKDOWN",
        "desc": "Plinth Area: 235m2, Porch Area: 40m2"
      },
      {
        "id": 3,
        "title": "BEDROOMS",
        "desc": "1 Master Bedroom: 4.8m X 4.6m, Walking Closet: 1.38m X 4.6m, Sleeping Area: 3.35m X 4.6m, 2 Bathrooms: 3.33m X 2.99m"
      },
      {
        "id": 4,
        "title": "ADDITIONAL ROOMS",
        "desc": "Garage Area: 5.98m X 6.16m, 2 Parking"
      },
      {
        "id": 5,
        "title": "OUTDOOR AREAS",
        "desc": "Porch: 40m2"
      },
      {
        "id": 6,
        "title": "KITCHEN",
        "desc": "Kitchen Area: 2.99m X 5.26m, Island: 0.9m X 1.2m"
      }
    ],
    renders: [
      {
        id: 1,
        url: "/hero/bonno/0001.webp",
        name: "0006",
        desertRefPath: "luyaridesigns/buildings/0001.webp"
      },
      {
        id: 2,
        url: "/hero/bonno/0002.webp",
        name: "0001",
        desertRefPath: "luyaridesigns/buildings/0002.webp"
      },
      {
        id: 3,
        url: "/hero/bonno/0003.webp",
        name: "0005",
        desertRefPath: "luyaridesigns/buildings/0003.webp"
      },
    ],
    drawings: [
      {
        id: 1,
        url: "/buildings/Elevations.webp",
        name: "Elevations",
        desertRefPath: "luyaridesigns/buildings/Elevations.webp"
      },
      {
        id: 2,
        url: "/buildings/floor-plans.webp",
        name: "floor-plans",
        desertRefPath: "luyaridesigns/buildings/floor-plans.webp"
      },
    ],
    modelsFiles: [
      {
        id: 1,
        url: "/buildings/Sitte_Option_grd_1.glb",
        name: "house_Opt_grd",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_grd.glb"
      }
    ],
    hideLevel: [
      {
        id: 1,
        priority:1,
        url: "/buildings/Sitte_Option_roof_1.glb",
        name: "1st floor",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_roof.glb"
      },
    ],
    supportFiles: [
      {
        id: 1,
        url: "/buildings/Sitte_Option_1.glb",
        name: "Site final",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_site.glb"
      }
    ],
    colors: [
      {
        id: 1,
        color: "gray",
        materialProperty: "main_Plaster_2",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_site.glb"
      },
      {
        id: 2,
        color: "light gray",
        materialProperty: "main_Plaster_1.Stucco",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_site.glb"
      },
      {
        id: 3,
        color: "white",
        materialProperty: "Stucco_White_Rough",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_site.glb"
      },
    ],
    _360sImages: [
      {
        id: 1,
        url: "/hero/bonno/360s/0007.webp",
        name: "360 pool view",
        desertRefPath: "luyaridesigns/Gnorth/360 front view.webp"
      },
      {
        id: 2,
        url: "/hero/bonno/360s/0008.webp",
        name: "360 front view",
        desertRefPath: "luyaridesigns/Gnorth/360 pool view.webp"
      },
      // {
      //   id: 3,
      //   url: "/hero/bonno/360s/0009.webp",
      //   name: "360 front view",
      //   desertRefPath: "luyaridesigns/Gnorth/360 pool view.webp"
      // }
    ],
    position:'0,0,0',
    arPosition:'0,0,0',
    minDistance: "30",
    maxDistance: "60",
    roomSnaps: [
      {
        id: 1,
        url: "/buildings/Sitte_Option_1_close_up.glb",
        name: "close up",
        desertRefPath: "luyaridesigns/buildings/1 front view 1.glb"
      },
      {
        id: 2,
        url: "/buildings/Sitte_Option_1_raod_view.glb",
        name: "road view",
        desertRefPath: "luyaridesigns/buildings/2 front view 2.glb"
      },
      {
        id: 3,
        url: "/buildings/Sitte_Option_1_rear_view.glb",
        name: "rear view",
        desertRefPath: "luyaridesigns/buildings/2 front view 2.glb"
      },
    ],
    presentationDrawings: [
      {
        id: 1,
        url: "https://firebasestorage.googleapis.com/v0/b/luyaridesigns-562cd.appspot.com/o/luyaridesigns%2FGnorth%2FFinal%20Brochure.pdf?alt=media&token=10c8d672-f9d9-48b7-b5b2-cba16bebe103",
        name: "Final Brochure",
        desertRefPath: "luyaridesigns/Gnorth/Final Brochure.pdf"
      }
    ],
    constructionDrawings: [
      {
        id: 1,
        url: "https://firebasestorage.googleapis.com/v0/b/luyaridesigns-562cd.appspot.com/o/luyaridesigns%2FGnorth%2FMr%20Masilo%20Drawings%20Rev1.pdf?alt=media&token=c8936de8-ca48-446a-a599-f9dccb20d6d6",
        name: "Mr Masilo Drawings Rev1",
        desertRefPath: "luyaridesigns/Gnorth/Mr Masilo Drawings Rev1.pdf"
      }
    ],
    createdAt: {
      "$date": "2024-06-13T10:27:06.191Z"
    },
    updatedAt: {
      "$date": "2024-06-13T10:27:06.191Z"
    }
  },
  {
    _id: 2,
    projectTitle: "G-North",
    siteSection: "featured",
    area: "2000",
    buildingTitle: "3 bedrooed house",
    buildingType: "single-storey",
    desc: "The brief was to come with a cozy 4 bedroom house with a guest room attached. It also had to have a pajama lounge for the viewing television as well as a separate formal lounge which would be used to entertain quests. The design needed to be trendy but understated. It need to sophisticated enough but affordable to build",
    buildingSummary: {
      "area": "235",
      "beds": "4",
      "level": "1",
      "baths": "3",
      "cars": "2"
    },
    features: "FEATURES: 4 Bedrooms, a Guest Bedroom, Breakfast - nook, Pajama-lounge, Scullery, formal dining, Office space, outdoor seating and entertainment area, and an airy kitchen",
    outroSection: "The design celebrates the life style of the client and as occurred as the plot was the challenge was truly inspirational",
    buildingHighlights: [
      {
        "id": 0,
        "title": "PLAN DIMENSIONS",
        "desc": "235M2 Area: 16.56m X 23.69m,Height: 5.6m"
      },
      {
        "id": 1,
        "title": "CEILING HEIGHTS",
        "desc": "2.7meters"
      },
      {
        "id": 2,
        "title": "SQUARE FOOTAGE BREAKDOWN",
        "desc": "Plinth Area: 235m2, Porch Area: 40m2"
      },
      {
        "id": 3,
        "title": "BEDROOMS",
        "desc": "1 Master Bedroom: 4.8m X 4.6m, Walking Closet: 1.38m X 4.6m, Sleeping Area: 3.35m X 4.6m, 2 Bathrooms: 3.33m X 2.99m"
      },
      {
        "id": 4,
        "title": "ADDITIONAL ROOMS",
        "desc": "Garage Area: 5.98m X 6.16m, 2 Parking"
      },
      {
        "id": 5,
        "title": "OUTDOOR AREAS",
        "desc": "Porch: 40m2"
      },
      {
        "id": 6,
        "title": "KITCHEN",
        "desc": "Kitchen Area: 2.99m X 5.26m, Island: 0.9m X 1.2m"
      }
    ],
    colors: [
      {
        id: 1,
        name: "gray",
        material: "main_Plaster_2",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_site.glb"
      },
      {
        id: 2,
        name: "light gray",
        material: "main_Plaster_1.Stucco",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_site.glb"
      },
      {
        id: 3,
        name: "white",
        material: "Stucco_White_Rough.Stucco",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_site.glb"
      },
    ],
    renders: [
      {
        id: 1,
        url: "/hero/bonno/0001.webp",
        name: "0006",
        desertRefPath: "luyaridesigns/buildings/0001.webp"
      },
      {
        id: 2,
        url: "/hero/bonno/0002.webp",
        name: "0001",
        desertRefPath: "luyaridesigns/buildings/0002.webp"
      },
      {
        id: 3,
        url: "/hero/bonno/0003.webp",
        name: "0005",
        desertRefPath: "luyaridesigns/buildings/0003.webp"
      },
    ],
    drawings: [
      {
        id: 1,
        url: "/buildings/Elevations.webp",
        name: "Elevations",
        desertRefPath: "luyaridesigns/buildings/Elevations.webp"
      },
      {
        id: 2,
        url: "/buildings/floor-plans.webp",
        name: "floor-plans",
        desertRefPath: "luyaridesigns/buildings/floor-plans.webp"
      },
    ],
    modelsFiles: [
      {
        id: 1,
        url: "/buildings/Sitte_Option_grd_1.glb",
        name: "house_Opt_grd",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_grd.glb"
      }
    ],
    hideLevel: [
      {
        id: 1,
        priority:1,
        url: "/buildings/Sitte_Option_roof_1.glb",
        name: "1st floor",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_roof.glb"
      },
    ],
    supportFiles: [
      {
        id: 1,
        url: "/buildings/Sitte_Option_1.glb",
        name: "Site final",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_site.glb"
      }
    ],
    _360sImages: [
      {
        id: 1,
        url: "/hero/bonno/360s/0001.webp",
        name: "360 pool view",
        desertRefPath: "luyaridesigns/Gnorth/360 front view.webp"
      },
      {
        id: 2,
        url: "/hero/bonno/360s/0002.webp",
        name: "360 front view",
        desertRefPath: "luyaridesigns/Gnorth/360 pool view.webp"
      },
      {
        id: 3,
        url: "/hero/bonno/360s/0003.webp",
        name: "360 front view",
        desertRefPath: "luyaridesigns/Gnorth/360 pool view.webp"
      }
    ],
    position:'0,0,0',
    arPosition:'0,0,0',
    minDistance: "30",
    maxDistance: "60",
    roomSnaps: [
      {
        id: 1,
        url: "/buildings/Sitte_Option_1_close_up.glb",
        name: "1 front view 1",
        desertRefPath: "luyaridesigns/buildings/1 front view 1.glb"
      },
      {
        id: 2,
        url: "/buildings/Sitte_Option_1_raod_view.glb",
        name: "2 front view 2",
        desertRefPath: "luyaridesigns/buildings/2 front view 2.glb"
      },
      {
        id: 3,
        url: "/buildings/Sitte_Option_1_rear_view.glb",
        name: "3 pool view",
        desertRefPath: "luyaridesigns/buildings/2 front view 2.glb"
      },
    ],
    presentationDrawings: [
      {
        id: 1,
        url: "https://firebasestorage.googleapis.com/v0/b/luyaridesigns-562cd.appspot.com/o/luyaridesigns%2FGnorth%2FFinal%20Brochure.pdf?alt=media&token=10c8d672-f9d9-48b7-b5b2-cba16bebe103",
        name: "Final Brochure",
        desertRefPath: "luyaridesigns/Gnorth/Final Brochure.pdf"
      }
    ],
    constructionDrawings: [
      {
        id: 1,
        url: "https://firebasestorage.googleapis.com/v0/b/luyaridesigns-562cd.appspot.com/o/luyaridesigns%2FGnorth%2FMr%20Masilo%20Drawings%20Rev1.pdf?alt=media&token=c8936de8-ca48-446a-a599-f9dccb20d6d6",
        name: "Mr Masilo Drawings Rev1",
        desertRefPath: "luyaridesigns/Gnorth/Mr Masilo Drawings Rev1.pdf"
      }
    ],
    createdAt: {
      "$date": "2024-06-13T10:27:06.191Z"
    },
    updatedAt: {
      "$date": "2024-06-13T10:27:06.191Z"
    }
  },
  {
    _id: 3,
    projectTitle: "G-North",
    siteSection: "featured",
    area: "2000",
    buildingTitle: "3 bedrooed house",
    buildingType: "single-storey",
    desc: "The brief was to come with a cozy 4 bedroom house with a guest room attached. It also had to have a pajama lounge for the viewing television as well as a separate formal lounge which would be used to entertain quests. The design needed to be trendy but understated. It need to sophisticated enough but affordable to build",
    buildingSummary: {
      "area": "235",
      "beds": "4",
      "level": "1",
      "baths": "3",
      "cars": "2"
    },
    features: "FEATURES: 4 Bedrooms, a Guest Bedroom, Breakfast - nook, Pajama-lounge, Scullery, formal dining, Office space, outdoor seating and entertainment area, and an airy kitchen",
    outroSection: "The design celebrates the life style of the client and as occurred as the plot was the challenge was truly inspirational",
    buildingHighlights: [
      {
        "id": 0,
        "title": "PLAN DIMENSIONS",
        "desc": "235M2 Area: 16.56m X 23.69m,Height: 5.6m"
      },
      {
        "id": 1,
        "title": "CEILING HEIGHTS",
        "desc": "2.7meters"
      },
      {
        "id": 2,
        "title": "SQUARE FOOTAGE BREAKDOWN",
        "desc": "Plinth Area: 235m2, Porch Area: 40m2"
      },
      {
        "id": 3,
        "title": "BEDROOMS",
        "desc": "1 Master Bedroom: 4.8m X 4.6m, Walking Closet: 1.38m X 4.6m, Sleeping Area: 3.35m X 4.6m, 2 Bathrooms: 3.33m X 2.99m"
      },
      {
        "id": 4,
        "title": "ADDITIONAL ROOMS",
        "desc": "Garage Area: 5.98m X 6.16m, 2 Parking"
      },
      {
        "id": 5,
        "title": "OUTDOOR AREAS",
        "desc": "Porch: 40m2"
      },
      {
        "id": 6,
        "title": "KITCHEN",
        "desc": "Kitchen Area: 2.99m X 5.26m, Island: 0.9m X 1.2m"
      }
    ],
    colors: [
      {
        id: 1,
        name: "main_Plaster_1",
        material: "main_Plaster_2",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_site.glb"
      },
      {
        id: 2,
        name: "light gray",
        material: "main_Plaster_1.Stucco",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_site.glb"
      },
      {
        id: 3,
        name: "white",
        material: "Stucco_White_Rough.Stucco",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_site.glb"
      },
    ],
    renders: [
      {
        id: 1,
        url: "/hero/bonno/0007.webp",
        name: "0006",
        desertRefPath: "luyaridesigns/buildings/0001.webp"
      },
      {
        id: 2,
        url: "/hero/bonno/0008.webp",
        name: "0001",
        desertRefPath: "luyaridesigns/buildings/0002.webp"
      },
      {
        id: 3,
        url: "/hero/bonno/0009.webp",
        name: "0005",
        desertRefPath: "luyaridesigns/buildings/0003.webp"
      },
    ],
    drawings: [
      {
        id: 1,
        url: "/buildings/Elevations.webp",
        name: "Elevations",
        desertRefPath: "luyaridesigns/buildings/Elevations.webp"
      },
      {
        id: 2,
        url: "/buildings/floor-plans.webp",
        name: "floor-plans",
        desertRefPath: "luyaridesigns/buildings/floor-plans.webp"
      },
    ],
    modelsFiles: [
      {
        id: 1,
        url: "/buildings/Sitte_Option_grd_3.glb",
        name: "house_Opt_grd",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_grd.glb"
      }
    ],
    hideLevel: [
      {
        id: 1,
        priority:1,
        url: "/buildings/Sitte_Option_roof_3.glb",
        name: "1st floor",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_roof.glb"
      },
    ],
    supportFiles: [
      {
        id: 1,
        url: "/buildings/Sitte_Option_3.glb",
        name: "Site final",
        desertRefPath: "luyaridesigns/Gnorth/house_Opt_site.glb"
      }
    ],
    _360sImages: [
      {
        id: 1,
        url: "/hero/bonno/360s/0001.webp",
        name: "360 pool view",
        desertRefPath: "luyaridesigns/Gnorth/360 front view.webp"
      },
      {
        id: 2,
        url: "/hero/bonno/360s/0002.webp",
        name: "360 front view",
        desertRefPath: "luyaridesigns/Gnorth/360 pool view.webp"
      },
      {
        id: 3,
        url: "/hero/bonno/360s/0003.webp",
        name: "360 front view",
        desertRefPath: "luyaridesigns/Gnorth/360 pool view.webp"
      }
    ],
    position:'43,0,0',
    arPosition:'0,0,0',
    minDistance: "30",
    maxDistance: "60",
    roomSnaps: [
      {
        id: 1,
        url: "/buildings/Sitte_Option_3_close_up.glb",
        name: "1 front view 1",
        desertRefPath: "luyaridesigns/buildings/1 front view 1.glb"
      },
      {
        id: 2,
        url: "/buildings/Sitte_Option_3_raod_view.glb",
        name: "2 front view 2",
        desertRefPath: "luyaridesigns/buildings/2 front view 2.glb"
      },
      {
        id: 3,
        url: "/buildings/Sitte_Option_3_rear_view.glb",
        name: "3 pool view",
        desertRefPath: "luyaridesigns/buildings/2 front view 2.glb"
      },
    ],
    presentationDrawings: [
      {
        id: 1,
        url: "https://firebasestorage.googleapis.com/v0/b/luyaridesigns-562cd.appspot.com/o/luyaridesigns%2FGnorth%2FFinal%20Brochure.pdf?alt=media&token=10c8d672-f9d9-48b7-b5b2-cba16bebe103",
        name: "Final Brochure",
        desertRefPath: "luyaridesigns/Gnorth/Final Brochure.pdf"
      }
    ],
    constructionDrawings: [
      {
        id: 1,
        url: "https://firebasestorage.googleapis.com/v0/b/luyaridesigns-562cd.appspot.com/o/luyaridesigns%2FGnorth%2FMr%20Masilo%20Drawings%20Rev1.pdf?alt=media&token=c8936de8-ca48-446a-a599-f9dccb20d6d6",
        name: "Mr Masilo Drawings Rev1",
        desertRefPath: "luyaridesigns/Gnorth/Mr Masilo Drawings Rev1.pdf"
      }
    ],
    createdAt: {
      "$date": "2024-06-13T10:27:06.191Z"
    },
    updatedAt: {
      "$date": "2024-06-13T10:27:06.191Z"
    }
  },
]