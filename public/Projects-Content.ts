import { title } from "process"

// Sample project data
export const projects = {
  games: [
    {
        id: 1,
        title: "Ghosts of Tabor",
        role: "UX/UI Artist",
        category:"Game",
        platform: "VR",
        description:"Ghosts of Tabor is VRs only FPS PVP and PVE survival game where you will use your wits, skills and resources to survive. Inspired by games such as Escape from Tarkov and DayZ, featuring different scenarios from scavenging to looting and crafting. Will you survive long enough to make it out alive?",
        tools:"Unreal Engine 4, Adobe Photoshop, Figma",
        coverImage: "/images/projects/games/GhostsOfTabor/Cover.png",
        coverAnimated: "/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
        videoUrl: "https://www.youtube.com/embed/7vhGAQvUl2g?si=mQyfS-3dz4UxxnXW&autoplay=1&mute=1&loop=1&playlist=7vhGAQvUl2g",
        designurl: "https://store.steampowered.com/app/1957780/Ghosts_of_Tabor/",
        designButtonLabel: "Steam Page",
        sections:[
        {
            title:"Project Overview",
            description:[
              { type: "heading", text: "Product" },
              { type: "paragraph", text: "The research was an exploration into player preferences within the survival game genre. This process included personal gameplay experiences and engaging directly with streamers and their audiences, which provided insights into mechanics, user interfaces, and overall player enjoyment factors." },
              
              { type: "heading", text: "Project Duration" },
              { type: "paragraph", text: "Development began in September 2019, with a focus on creating a grounded, immersive survival experience." },
              
              { type: "heading", text: "My Role" },
              { type: "paragraph", text: "I was involved in various aspects of the game's development." },
              { type: "list", items: [
                "Design of User Interfaces for desktop and mobile platforms",
                "Implementation of interactive elements",
                "Team collaboration with designers, developers, and QA",
                "Maintaining consistency in design elements across platforms"
              ]},
              
            ],
            image:"",
        },
        {
            title:"Research",
            description:[
              { type: "heading", text: "Summary" },
              { type: "paragraph", text: "The research was an exploration into player preferences within the survival game genre. This process included personal gameplay experiences and engaging directly with streamers and their audiences, which provided insights into mechanics, user interfaces, and overall player enjoyment factors." },
              
              { type: "heading", text: "Target Audience" },
              { type: "paragraph", text: "Development began in September 2019, with a focus on creating a grounded, immersive survival experience." },
              
              { type: "heading", text: "Benchmark" },
              { type: "paragraph", text: "I was involved in various aspects of the game's development." },
              { type: "list", items: [
                "Design of User Interfaces for desktop and mobile platforms",
                "Implementation of interactive elements",
                "Team collaboration with designers, developers, and QA",
                "Maintaining consistency in design elements across platforms"
              ]},
              
            ],
            image:"/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
        },
    
 
    

        ],
        images: [
            "/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
            "/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
        ],

    },
    // {
    //     id: 2,
    //     title: "Polker",
    //     role: "Unreal Developer",
    //     category:"",
    //     platform: "PC,Mobile",
    //     description:"",
    //     tools:"",
    //     coverImage: "/images/projects/games/Polker/Cover.png",
    //     coverAnimated: "/images/projects/games/Polker/AnimatedCover.png",
    //     images: [
    //         "/images/projects/games/Polker/AnimatedCover.png",

    //     ],
    //     videoUrl: "",
    //     designurl: "https://anageek.github.io",
    //     designButtonLabel: "View Design Process",
    // },
    // {
    //     id: 3,
    //     title: "Kalyskah",
    //     role: "Unreal Developer",
    //     category:"",
    //     platform: "PC",
    //     description:"",
    //     tools:"",
    //     coverImage: "/images/projects/games/Kalyskah/Cover.png",
    //     coverAnimated: "/images/projects/games/Kalyskah/AnimatedCover.jpeg",
    //     images: [
    //         "/images/projects/games/Kalyskah/AnimatedCover.jpeg",

    //     ],
    //     videoUrl: "",
    //     designurl: "https://anageek.github.io",
    //     designButtonLabel: "View Design Process",
    // },
    // {
    //     id: 4,
    //     title: "Naufrago",
    //     role: "Unreal Developer, Personal Project",
    //     category:"",
    //     platform: "PC",
    //     description:"Naufrago is a survival exploration game set on a remote, mysterious island. This early alpha represents the first playable environment—Crab Island—where players must gather resources, craft tools, and adapt to the challenges of an isolated landscape.Development began in September 2019, with a focus on creating a grounded, immersive survival experience. This prototype showcases the game's core mechanics, atmosphere, and design direction.",
    //     tools:"Unreal Engine 4, Adobe Photoshop, Blender",
    //     coverImage: "/images/projects/games/Naufrago/Cover.png",
    //     coverAnimated: "/images/projects/games/Naufrago/AnimatedCover.gif",
    //     images: [
    //         "/images/projects/games/Naufrago/craftString.gif?height=600&width=800",
    //         "/images/projects/games/Naufrago/placetable.gif?height=600&width=800",
    //         "/images/projects/games/Naufrago/AnimatedCover.gif?height=600&width=800",
    //         "/images/projects/games/Naufrago/modifyItem.png?height=600&width=800",
    //         "/images/projects/games/Naufrago/worktable.png?height=600&width=800",
    //         "/images/projects/games/Naufrago/fire.png?height=600&width=800",

    //     ],
    //     videoUrl: "https://www.youtube.com/embed/EwmypPEZRCk?si=klUukMkoSZrB8KKo",
    //     designurl: "https://anageek.github.io",
    //     designButtonLabel: "View Design Process",
    // },
    // {
    //     id: 5,
    //     title: "Pixel Escape",
    //     role: "Unreal Developer, Personal Project",
    //     category:"",
    //     platform: "PC",
    //     description:"",
    //     tools:"",
    //     coverImage: "/images/projects/games/PixelEscape/Cover.png",
    //     coverAnimated: "/images/projects/games/PixelEscape/AnimatedCover.gif",
    //     images: [
    //         "/images/projects/games/Kalyskah/AnimatedCover.jpeg",

    //     ],
    //     videoUrl: "",
    //     designurl: "https://anageek.github.io",
    //     designButtonLabel: "View Design Process",
    // },
    // {
    //     id: 6,
    //     title: "Pirate's Attack",
    //     role: "Unreal Developer, Personal Project",
    //     category:"",
    //     platform: "PC",
    //     description:"",
    //     tools:"",
    //     coverImage: "/images/projects/games/PiratesAttack/Cover.jpeg",
    //     coverAnimated: "/images/projects/games/PiratesAttack/AnimatedCover.png",
    //     images: [
    //         "/images/projects/games/Kalyskah/AnimatedCover.jpeg",

    //     ],
    //     videoUrl: "",
    //     designurl: "https://anageek.github.io",
    //     designButtonLabel: "View Design Process",
    
    // },
    // {
    //     id: 7,
    //     title: "Joe's Christmas",
    //     role: "Unreal Developer, Personal Project",
    //     category:"",
    //     platform: "PC",
    //     description:"",
    //     tools:"",
    //     coverImage: "/images/projects/games/JoesChristmas/Cover.jpeg",
    //     coverAnimated: "/images/projects/games/JoesChristmas/AnimatedCover.jpg",
    //     images: [
    //         "/images/projects/games/Kalyskah/AnimatedCover.jpeg",

    //     ],
    //     videoUrl: "",
    //     designurl: "https://anageek.github.io",
    //     designButtonLabel: "View Design Process",
    // },
  ],
  uiux: [
    {
      id: 1,
      title: "Logo Design",
      role: "UX/UI ",
      category:"Design",
      platform: "",
      description:"Logo done for a twitch channel",
      tools:"Adobe Photoshop",
      coverImage: "/images/projects/design/Sousa/Portfolio.png",
      coverAnimated: "/images/projects/design/Sousa/Portfolio.png",
      sections:[
        {
            title:"teste",
            description:[
              { type: "heading", text: " " },
              { type: "paragraph", text: " " },
              { type: "list", items: [
                " ",
                
              ]},
            ],
            image:"/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
        },
    ],
      images: [
            "/images/projects/design/Sousa/Portfolio.png",
      ],
      videoUrl: "",
      designurl: "https://anageek.github.io",
      designButtonLabel: "View Design Process",
    },
    // {
    //   id: 2,
    //   title: "Titlte Placeholder",
    //   role: "Role Placeholder",
    //   category:"Category Placeholder",
    //   platform: "Platform Placeholder",
    //   description:"Description Placeholder",
    //   tools:"Tools Placeholder",
    //   coverImage: "placeholder.svg?height=400&width=600",
    //   coverAnimated: "placeholder.svg?height=400&width=600",
    //   images: [
    //         "placeholder.svg?height=400&width=600",
    //         "placeholder.svg?height=400&width=600",
    //   ],
    //   videoUrl: "",
    //   designurl: "https://anageek.github.io",
    //   designButtonLabel: "View Design Process",
    // },
    // {
    //   id: 3,
    //   title: "Titlte Placeholder",
    //   role: "Role Placeholder",
    //   category:"Category Placeholder",
    //   platform: "Platform Placeholder",
    //   description:"Description Placeholder",
    //   tools:"Tools Placeholder",
    //   coverImage: "placeholder.svg?height=400&width=600",
    //   coverAnimated: "placeholder.svg?height=400&width=600",
    //   images: [
    //         "placeholder.svg?height=400&width=600",
    //         "placeholder.svg?height=400&width=600",
    //   ],
    //   videoUrl: "",
    //   designurl: "https://anageek.github.io",
    //   designButtonLabel: "View Design Process",
    // },
    // {
    //   id: 4,
    //   title: "Titlte Placeholder",
    //   role: "Role Placeholder",
    //   category:"Category Placeholder",
    //   platform: "Platform Placeholder",
    //   description:"Description Placeholder",
    //   tools:"Tools Placeholder",
    //   coverImage: "placeholder.svg?height=400&width=600",
    //   coverAnimated: "placeholder.svg?height=400&width=600",
    //   images: [
    //         "placeholder.svg?height=400&width=600",
    //         "placeholder.svg?height=400&width=600",
    //   ],
    //   videoUrl: "",
    //   designurl: "https://anageek.github.io",
    //   designButtonLabel: "View Design Process",
    // },
    // {
    //   id: 5,
    //   title: "Titlte Placeholder",
    //   role: "Role Placeholder",
    //   category:"Category Placeholder",
    //   platform: "Platform Placeholder",
    //   description:"Description Placeholder",
    //   tools:"Tools Placeholder",
    //   coverImage: "placeholder.svg?height=400&width=600",
    //   coverAnimated: "placeholder.svg?height=400&width=600",
    //   images: [
    //         "placeholder.svg?height=400&width=600",
    //         "placeholder.svg?height=400&width=600",
    //   ],
    //   videoUrl: "",
    //   designurl: "https://anageek.github.io",
    //   designButtonLabel: "View Design Process",
    // },
    
  ],
  modeling: [
    {
        id: 1,
        title: "Titlte Placeholder",
        role: "Role Placeholder",
        category:"Category Placeholder",
        platform: "Platform Placeholder",
        description:"Description Placeholder",
        tools:"Tools Placeholder",
        coverImage: "placeholder.svg?height=400&width=600",
        coverAnimated: "placeholder.svg?height=400&width=600",
        sections:[
        {
            title:"teste",
            description:[
              { type: "heading", text: " " },
              { type: "paragraph", text: " " },
              { type: "list", items: [
                " ",
                
              ]},
            ],
            image:"/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
        },
         ],
        images: [
            "placeholder.svg?height=400&width=600",
            "placeholder.svg?height=400&width=600",
        ],
        videoUrl: "",
        designurl: "https://anageek.github.io",
        designButtonLabel: "View Design Process",
    },
    // {
    //     id: 2,
    //     title: "Titlte Placeholder",
    //     role: "Role Placeholder",
    //     category:"Category Placeholder",
    //     platform: "Platform Placeholder",
    //     description:"Description Placeholder",
    //     tools:"Tools Placeholder",
    //     coverImage: "placeholder.svg?height=400&width=600",
    //     coverAnimated: "placeholder.svg?height=400&width=600",
    //     images: [
    //         "placeholder.svg?height=400&width=600",
    //         "placeholder.svg?height=400&width=600",
    //     ],
    //     videoUrl: "",
    //     designurl: "https://anageek.github.io",
    //     designButtonLabel: "View Design Process",
    // },
    // {
    //     id: 3,
    //     title: "Titlte Placeholder",
    //     role: "Role Placeholder",
    //     category:"Category Placeholder",
    //     platform: "Platform Placeholder",
    //     description:"Description Placeholder",
    //     tools:"Tools Placeholder",
    //     coverImage: "placeholder.svg?height=400&width=600",
    //     coverAnimated: "placeholder.svg?height=400&width=600",
    //     images: [
    //         "placeholder.svg?height=400&width=600",
    //         "placeholder.svg?height=400&width=600",
    //     ],
    //     videoUrl: "",
    //     designurl: "https://anageek.github.io",
    //     designButtonLabel: "View Design Process",
    // },
 
  ],
  design: [
    {
        id: 1,
        title: "Titlte Placeholder",
        role: "Role Placeholder",
        category:"Category Placeholder",
        platform: "Platform Placeholder",
        description:"Description Placeholder",
        tools:"Tools Placeholder",
        coverImage: "placeholder.svg?height=400&width=600",
        coverAnimated: "placeholder.svg?height=400&width=600",
        sections:[
        {
            title:"test222e",
            description:[
              { type: "heading", text: "Summary" },
              { type: "paragraph", text: "The research was an exploration into player preferences within the survival game genre. This process included personal gameplay experiences and engaging directly with streamers and their audiences, which provided insights into mechanics, user interfaces, and overall player enjoyment factors." },
              { type: "list", items: [
                " ",
                
              ]},
            ],
            image:"/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
        },


        
        ],
        images: [
            "placeholder.svg?height=400&width=600",
            "placeholder.svg?height=400&width=600",
        ],
        videoUrl: "",
        designurl: "https://anageek.github.io",
        designButtonLabel: "View Design Process",
    },
    // {
    //     id: 2,
    //     title: "Titlte Placeholder",
    //     role: "Role Placeholder",
    //     category:"Category Placeholder",
    //     platform: "Platform Placeholder",
    //     description:"Description Placeholder",
    //     tools:"Tools Placeholder",
    //     coverImage: "placeholder.svg?height=400&width=600",
    //     coverAnimated: "placeholder.svg?height=400&width=600",
    //     images: [
    //         "placeholder.svg?height=400&width=600",
    //         "placeholder.svg?height=400&width=600",
    //     ],
    //     videoUrl: "",
    //     designurl: "https://anageek.github.io",
    //     designButtonLabel: "View Design Process",
    // },
   

    
  
  ],
};