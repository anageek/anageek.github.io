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
      designurl: "https://anageek.itch.io/naufrago",
      designButtonLabel: "Download Game",
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
            { type: "paragraph", text: "Solo Developer - Responsible for the entire development cycle of the game, including game design, programming, art direction, UI/UX, sound integration, and testing. Managed all aspects from concept to release." },

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
            { type: "paragraph", text: "To find inspiration for this game, I benchmarked against successful titles such as Raft, The Sims 2 Castaway, The Forest, Astroneer, and Subnautica. The objective was to analyze gameplay mechanics, UI/UX design, and player interaction patterns. My criteria included aesthetics, user experience, and customization options. These games excel in areas like multiplayer capabilities and high-quality graphics, but they often fall short in customization and offering a diverse range of enemies and challenges. By understanding the strengths and weaknesses of these titles, I aim to create a game that offers a well-rounded and engaging player experience." },

          ],
          image: "/images/projects/games/Naufrago/Research.png",
        },
        {
          title: "Logo Design",
          description: [
            { type: "heading", text: "Overview" },
            { type: "paragraph", text: "The idea was to bring the tropical environment to the logo since the game is on a island. with that in mind I wanted to use natural elements as stone and wood as a texture material" },

            { type: "heading", text: "Drafts" },
            { type: "image", image: "/images/projects/games/Naufrago/Logo-Study.png" },

            { type: "heading", text: "Typography" },
            { type: "image", image: "/images/projects/games/Naufrago/Woodpecker demo.png" },
            { type: "paragraph", text: "I chose the Woodpecker demo font for the 'Naufrago' game logo because its rustic, handcrafted look aligns with the game's theme of survival and crafting on a wild island. The font's distinctive, natural texture sets an adventurous mood and ensures memorable brand recognition." },

            { type: "heading", text: "Color Pallete" },
            { type: "image", image: "/images/projects/games/Naufrago/Logo-Color-Palette.png" },

          ],
          image: "/images/projects/games/Naufrago/Logo-Redesign.png",
        },
        {
          title: "Character Design",
          description: [
            { type: "paragraph", text: "Creating this female character centered on her vibrant and adventurous personality, inspired by themes from Moana and Fortnite. Her beach-themed attire, warm tones, and cultural jewelry highlight her strength, empathy, and wit. While the male character is still in progress, this design reflects my approach to crafting characters that enhance the game’s story and style." },
            { type: "image", image: "/images/projects/games/Naufrago/Character-Design.png" },

          ],
          image: "",
        },
       
        {
          title: "UX/UI Design",
          description: [
            { type: "heading", text: "User Flow" },
            { type: "paragraph", text: "The user flow for Naufrago is designed to provide a seamless and engaging experience for players. It guides them through the game's core mechanics, from initial exploration to crafting and survival tasks." },
            { type: "image", image: "/images/projects/games/Naufrago/UserFlow.png" },

            { type: "heading", text: "Wireframes" },
            { type: "paragraph", text: "The wireframes for Naufrago were created to visualize the game's user interface and interactions. They serve as a blueprint for the game's design, ensuring that all elements are intuitive and user-friendly." },
            { type: "image", image: "/images/projects/games/Naufrago/Wireframes.png" },

            { type: "heading", text: "Mockups" },
            { type: "paragraph", text: "The mockups for Naufrago provide a detailed view of the game's user interface, showcasing the design elements and layout. They are essential for visualizing the final look and feel of the game." },
            { type: "image", image: "/images/projects/games/Naufrago/Mockups.png" },

            { type: "heading", text: "UI/Design Systems" },
            { type: "paragraph", text: "The UI/Design systems for Naufrago are crafted to enhance player immersion and interaction. The design focuses on intuitive navigation, clear feedback, and a cohesive visual style that complements the game's tropical setting." },
            { type: "image", image: "/images/projects/games/Naufrago/Elements.png" },
            { type: "image", image: "/images/projects/games/Naufrago/Elements2.png" },

          ],
          image: "",
        },
      ],



    },
    //Pixel Escape
    {
      id: 2,
      title: "Pixel Escape",
      role: "Unreal Developer",
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
      videoUrl: "https://www.youtube.com/embed/my30Iyym_0o?si=yQpem1K0mEu53PAk",
      designurl: "https://anageek.itch.io/pixel-escape-o-enigma-de-lucas",
      designButtonLabel: "Download Game",
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
            { type: "image", image: "" },
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
      videoUrl: "https://www.youtube.com/embed/_s-V_9SB6fs?si=OHAMfSQIR6by9zsl",
      designurl: "https://anageek.itch.io/pirates-attack",
      designButtonLabel: "Download Game",
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
            { type: "image", image: "" },
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
            { type: "image", image: "" },

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
            { type: "image", image: "" },

          ],
          image: "/images/projects/uiux/GhostsOfTabor/AnimatedCover.gif",
        },




      ],
      images: [
        "/images/projects/uiux/GhostsOfTabor/AnimatedCover.gif",
        "/images/projects/uiux/GhostsOfTabor/AnimatedCover.gif",
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
            { type: "image", image: "" },
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
            { type: "image", image: "" },

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
            { type: "image", image: "" },

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
            { type: "image", image: "" },

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
            { type: "image", image: "" },
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
        "",
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
            { type: "image", image: "" },
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
            { type: "image", image: "" },
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