import { title } from "process"

// Sample project data
export const projects = {
  games: [
    //Naufrago
    {
      id: 1,
      title: "Naufrago",
      role: "Unreal Developer",
      company: "Personal Project",
      status: "Alpha Version",
      category: "",
      platform: [
        "PC",
      ],
      description: "Naufrago is a survival exploration game set on a remote island. This early alpha represents the first playable environment: Crab Island, where players must gather resources, craft tools, and adapt to the challenges of an isolated landscape.Development began in September 2019, with a focus on creating a grounded, immersive survival experience. This prototype showcases the game's core mechanics, atmosphere, and design direction.",
      tools: "Unreal Engine 4, Adobe Photoshop, Blender",
      coverImage: "/images/projects/games/Naufrago/Overview.png",
      coverAnimated: "/images/projects/games/Naufrago/AnimatedCover.gif",
      videoUrl: "https://www.youtube.com/embed/EwmypPEZRCk?si=klUukMkoSZrB8KKo",
      designurl: "https://anageek.github.io",
      designButtonLabel: "View Design Process",
      images: [
        "/images/projects/games/Naufrago/craftString.gif?height=600&width=800",
        "/images/projects/games/Naufrago/placetable.gif?height=600&width=800",
        "/images/projects/games/Naufrago/AnimatedCover.gif?height=600&width=800",
        "/images/projects/games/Naufrago/modifyItem.png?height=600&width=800",
        "/images/projects/games/Naufrago/worktable.png?height=600&width=800",
        "/images/projects/games/Naufrago/fire.png?height=600&width=800",
      ],
      sections: [
        {
          title: "Project Overview",
          description: [
            { type: "heading", text: "Project Duration" },
            { type: "paragraph", text: "The development took around 2 years" },

            { type: "heading", text: "My Role" },
            { type: "paragraph", text: "The development took around 2 years" },
            {
              type: "list", items: [
                "Game Design: Conceptualizing mechanics, systems, and gameplay.",
                "Programming: Writing and optimizing gameplay, UI, and system code.",
                "UI/UX Design: Creating intuitive interfaces for easy navigation and interaction.",
                "Art and Animation: Designing and animating visual elements.",
                "Sound Design: Integrating sound effects and music for immersion.",
                "Testing and Debugging: Conducting playtesting and debugging for a polished experience.",
              ]
            },
          ],
          image: "/images/projects/games/Naufrago/Overview.png",
        },
        {
          title: "Research",
          description: [
            { type: "heading", text: "Summary" },
            { type: "paragraph", text: "The research was an exploration into player preferences within the survival game genre. This process included personal gameplay experiences and engaging directly with streamers and their audiences, which provided insights into mechanics, user interfaces, and overall player enjoyment factors." },

            { type: "heading", text: "Target Audience" },
            { type: "paragraph", text: "The research for Naufrago identified a target audience of players who enjoy stylized, vibrant survival games with a touch of whimsy. This audience appreciates bright colors, engaging narratives, and unique interactions. By studying player behavior in similar games and gathering feedback through streaming platforms like Twitch." },

            { type: "heading", text: "Benchmark" },
            { type: "paragraph", text: "To find inspiration for my game, I benchmarked against successful titles such as Raft, The Sims 2 Castaway, The Forest, Astroneer, and Subnautica. The objective was to analyze gameplay mechanics, UI/UX design, and player interaction patterns. My criteria included aesthetics, user experience, and customization options. These games excel in areas like multiplayer capabilities and high-quality graphics, but they often fall short in customization and offering a diverse range of enemies and challenges. By understanding the strengths and weaknesses of these titles, I aim to create a game that offers a well-rounded and engaging player experience." },
            
          ],
          image: "/images/projects/games/Naufrago/Research.png",
        },
      ],



    },
    //Pixel Escape
    {
      id: 2,
      title: "Pixel Escape",
      role: "Unreal Developer, Personal Project",
      company: "Personal Project",
      status: "Alpha Version",
      category: "",
      platform: [
        "PC",
      ],
      description: "",
      tools: "",
      coverImage: "/images/projects/games/PixelEscape/Cover.png",
      coverAnimated: "/images/projects/games/PixelEscape/AnimatedCover.gif",
      videoUrl: "",
      designurl: "https://anageek.github.io",
      designButtonLabel: "View Design Process",
      sections: [
        {
          title: "Project Overview",
          description: [
            { type: "heading", text: "Product" },
            { type: "paragraph", text: " " },
            {
              type: "list", items: [
                " ",
                " ",
              ]
            },
          ],
          image: "",
        },
      ],
      images: [
        "/images/projects/games/PixelEscape/Cover.png",

      ],
    },
    {
      id: 3,
      title: "Pirate's Attack",
      role: "Unreal Developer, Personal Project",
      company: "Personal Project",
      status: "Alpha Version",
      category: "",
      platform: [
        "PC",
      ],
      description: "",
      tools: "",
      coverImage: "/images/projects/games/PiratesAttack/Cover.jpeg",
      coverAnimated: "/images/projects/games/PiratesAttack/AnimatedCover.png",
      videoUrl: "",
      designurl: "https://anageek.github.io",
      designButtonLabel: "View Design Process",
      sections: [
        {
          title: "Project Overview",
          description: [
            { type: "heading", text: "Product" },
            { type: "paragraph", text: " " },
            {
              type: "list", items: [
                " ",
                " ",
              ]
            },
          ],
          image: "",
        },
      ],
      images: [
        "/images/projects/games/PiratesAttack/Cover.jpeg",

      ],
    },
    // {
    //     id: 7,
    //     title: "Joe's Christmas",
    //     role: "Unreal Developer, Personal Project",
    //company: "Personal Project",
    // status: "Alpha Version",
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
      title: "Ghosts of Tabor",
      role: "UX/UI Artist",
      company: "Combat Waffle Studios",
      status: "Early Access",
      category: "Game",
      platform: [
        "VR",
      ],
      description: "Ghosts of Tabor is VRs only FPS PVP and PVE survival game where you will use your wits, skills and resources to survive. Inspired by games such as Escape from Tarkov and DayZ, featuring different scenarios from scavenging to looting and crafting. Will you survive long enough to make it out alive?",
      tools: "Unreal Engine 4, Adobe Photoshop, Figma",
      coverImage: "/images/projects/uiux/GhostsOfTabor/Cover.png",
      coverAnimated: "/images/projects/uiux/GhostsOfTabor/AnimatedCover.gif",
      videoUrl: "https://www.youtube.com/embed/7vhGAQvUl2g?si=mQyfS-3dz4UxxnXW&autoplay=1&mute=1&loop=1&playlist=7vhGAQvUl2g",
      designurl: "https://store.steampowered.com/app/1957780/Ghosts_of_Tabor/",
      designButtonLabel: "Steam Page",
      sections: [
        {
          title: "Project Overview",
          description: [
            { type: "heading", text: "Product" },
            { type: "paragraph", text: "The research was an exploration into player preferences within the survival game genre. This process included personal gameplay experiences and engaging directly with streamers and their audiences, which provided insights into mechanics, user interfaces, and overall player enjoyment factors." },

            { type: "heading", text: "Project Duration" },
            { type: "paragraph", text: "Development began in September 2019, with a focus on creating a grounded, immersive survival experience." },

            { type: "heading", text: "My Role" },
            { type: "paragraph", text: "I was involved in various aspects of the game's development." },
            {
              type: "list", items: [
                "Design of User Interfaces for desktop and mobile platforms",
                "Implementation of interactive elements",
                "Team collaboration with designers, developers, and QA",
                "Maintaining consistency in design elements across platforms"
              ]
            },

          ],
          image: "",
        },
        {
          title: "Research",
          description: [
            { type: "heading", text: "Summary" },
            { type: "paragraph", text: "The research was an exploration into player preferences within the survival game genre. This process included personal gameplay experiences and engaging directly with streamers and their audiences, which provided insights into mechanics, user interfaces, and overall player enjoyment factors." },

            { type: "heading", text: "Target Audience" },
            { type: "paragraph", text: "Development began in September 2019, with a focus on creating a grounded, immersive survival experience." },

            { type: "heading", text: "Benchmark" },
            { type: "paragraph", text: "I was involved in various aspects of the game's development." },
            {
              type: "list", items: [
                "Design of User Interfaces for desktop and mobile platforms",
                "Implementation of interactive elements",
                "Team collaboration with designers, developers, and QA",
                "Maintaining consistency in design elements across platforms"
              ]
            },

          ],
          image: "/images/projects/uiux/GhostsOfTabor/AnimatedCover.gif",
        },




      ],
      images: [
        "/images/projects/uiux/GhostsOfTabor/AnimatedCover.gif",
        "/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
      ],

    },
    {
      id: 2,
      title: "Polker",
      role: "Unreal Developer",
      company: "Polker Games",
      status: "Released",
      category: "",
      platform: [
        "PC",
        "Mobile",
      ],
      description: "Polker is a play-to-earn NFT poker game, developed in Unreal Engine to deliver a fully immersive experience. Available on the Epic Store, it combines the excitement of poker with the innovation of blockchain technology, allowing players to enjoy a non-gambling, free-to-play environment where they can earn and use NFTs both in-game and beyond.",
      tools: "Unreal Engine 5, Figma, Adobe Photoshop",
      coverImage: "/images/projects/uiux/Polker/Cover.png",
      coverAnimated: "/images/projects/uiux/Polker/AnimatedCover.png",
      videoUrl: "",
      designurl: "https://store.epicgames.com/en-US/p/polker-59bb9f",
      designButtonLabel: "Download Game",
      sections: [
        {
          title: "Project Overview",
          description: [

            { type: "heading", text: "Project Duration" },
            { type: "paragraph", text: "My contribution to the Polker project spanned approximately XX months. " },

            { type: "heading", text: "My Role" },
            {
              type: "list", items: [
                "I designed user interfaces for both desktop applications and mobile platforms, ensuring a seamless and engaging user experience.",
                "I implemented these user interfaces, translating design concepts into functional and interactive elements.",
                "I collaborated with a team of designers, developers, and QA testers to conceptualize and execute innovative solutions.",
                "I maintained consistency in design elements and visual standards across multiple platforms and devices.",
              ]
            },
          ],
          image: "/images/projects/uiux/Polker/Project-Overview.png",
        },
        {
          title: "Reasearch",
          description: [

            { type: "heading", text: "Summary" },
            { type: "paragraph", text: "I researched various poker games to explore UI and UX approaches. The goal was to find effective design patterns and unique features we could adapt to improve the overall experience in Polker." },

            { type: "heading", text: "Target Audience" },
            { type: "paragraph", text: "Crypto-savvy players, card game enthusiasts, NFT collectors." },

            { type: "heading", text: "Benchmark" },
            { type: "paragraph", text: " I benchmarked Poker Club and Zynga Poker for their UI/UX. Poker Club provided inspiration for the PC version of Polker with its sleek visuals and immersive interface, while Zynga Poker helped shape the mobile version thanks to its clean, accessible design. These references guided the development of Polker's UI, helping us create a polished and engaging experience across platforms." },


          ],
          image: "/images/projects/uiux/Polker/Research-games.png",
        },
        {
          title: "Design",
          description: [
            { type: "heading", text: "User Flow" },
            { type: "paragraph", text: "My contribution to the Polker project spanned approximately 10 months. " },
          ],
          image: "/images/projects/uiux/Polker/UserFlow.png",
        },
        {
          title: "UI/Design Systems",
          description: [
           
          ],
          image: "/placeholder.svg",
        },




      ],
      images: [
        "/images/projects/uiux/Polker/AnimatedCover.png",

      ],
    },
    {
      id: 3,
      title: "Kalyskah",
      role: "Unreal Developer",
      category: "",
      platform: [
        "PC",
      ],
      description: "",
      tools: "",
      coverImage: "/images/projects/uiux/Kalyskah/Cover.png",
      coverAnimated: "/images/projects/uiux/Kalyskah/AnimatedCover.jpeg",
      videoUrl: "",
      designurl: "https://anageek.github.io",
      designButtonLabel: "View Design Process",
      sections: [
        {
          title: "Project Overview",
          description: [
            { type: "heading", text: "Product" },
            { type: "paragraph", text: "The research was an exploration into player preferences within the survival game genre. This process included personal gameplay experiences and engaging directly with streamers and their audiences, which provided insights into mechanics, user interfaces, and overall player enjoyment factors." },

            { type: "heading", text: "Project Duration" },
            { type: "paragraph", text: "Development began in September 2019, with a focus on creating a grounded, immersive survival experience." },

            { type: "heading", text: "My Role" },
            { type: "paragraph", text: "I was involved in various aspects of the game's development." },
            {
              type: "list", items: [
                "Design of User Interfaces for desktop and mobile platforms",
                "Implementation of interactive elements",
                "Team collaboration with designers, developers, and QA",
                "Maintaining consistency in design elements across platforms"
              ]
            },

          ],
          image: "",
        },
        {
          title: "Research",
          description: [
            { type: "heading", text: "Summary" },
            { type: "paragraph", text: "The research was an exploration into player preferences within the survival game genre. This process included personal gameplay experiences and engaging directly with streamers and their audiences, which provided insights into mechanics, user interfaces, and overall player enjoyment factors." },

            { type: "heading", text: "Target Audience" },
            { type: "paragraph", text: "Development began in September 2019, with a focus on creating a grounded, immersive survival experience." },

            { type: "heading", text: "Benchmark" },
            { type: "paragraph", text: "I was involved in various aspects of the game's development." },
            {
              type: "list", items: [
                "Design of User Interfaces for desktop and mobile platforms",
                "Implementation of interactive elements",
                "Team collaboration with designers, developers, and QA",
                "Maintaining consistency in design elements across platforms"
              ]
            },

          ],
          image: "/images/projects/uiux/GhostsOfTabor/AnimatedCover.gif",
        },




      ],
      images: [
        "/images/projects/uiux/Kalyskah/AnimatedCover.jpeg",

      ],
    },


  ],
  modeling: [
    {
      id: 1,
      title: "Titlte Placeholder",
      role: "Role Placeholder",
      category: "Category Placeholder",
      platform: [
        "PC",
      ],
      description: "Description Placeholder",
      tools: "Tools Placeholder",
      coverImage: "placeholder.svg?height=400&width=600",
      coverAnimated: "placeholder.svg?height=400&width=600",
      sections: [
        {
          title: "teste",
          description: [
            { type: "heading", text: " " },
            { type: "paragraph", text: " " },
            {
              type: "list", items: [
                " ",

              ]
            },
          ],
          image: "/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
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
      title: "Logo Design",
      role: "UX/UI ",
      category: "Design",
      platform: [
        "PC",
      ],
      description: "Logo done for a twitch channel",
      tools: "Adobe Photoshop",
      coverImage: "/images/projects/design/Sousa/Portfolio.png",
      coverAnimated: "/images/projects/design/Sousa/Portfolio.png",
      sections: [
        {
          title: "teste",
          description: [
            { type: "heading", text: " " },
            { type: "paragraph", text: " " },
            {
              type: "list", items: [
                " ",

              ]
            },
          ],
          image: "/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
        },
      ],
      images: [
        "/images/projects/design/Sousa/Portfolio.png",
      ],
      videoUrl: "",
      designurl: "https://anageek.github.io",
      designButtonLabel: "View Design Process",
    },
    {
      id: 2,
      title: "Titlte Placeholder",
      role: "Role Placeholder",
      category: "Category Placeholder",
      platform: [
        "PC",
      ],
      description: "Description Placeholder",
      tools: "Tools Placeholder",
      coverImage: "placeholder.svg?height=400&width=600",
      coverAnimated: "placeholder.svg?height=400&width=600",
      sections: [
        {
          title: "test222e",
          description: [
            { type: "heading", text: "Summary" },
            { type: "paragraph", text: "The research was an exploration into player preferences within the survival game genre. This process included personal gameplay experiences and engaging directly with streamers and their audiences, which provided insights into mechanics, user interfaces, and overall player enjoyment factors." },
            {
              type: "list", items: [
                " ",

              ]
            },
          ],
          image: "/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
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