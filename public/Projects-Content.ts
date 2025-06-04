import { platform } from "os";
import { title } from "process"

// Sample project data
export const projects = {
  games: [
    //Naufrago 
    {
      id: 1,
      title: "Naufrago",
      role: "Unreal Developer",
      company: "Ana Neiva",
      status: "Alpha Version",
      category: "Suvival/Exploration",
      platform: [
        "PC",
      ],
      description: "Naufrago is a survival exploration game set on a remote island. This early alpha represents the first playable environment: Crab Island, where players must gather resources, craft tools, and adapt to the challenges of an isolated landscape.Development began in September 2019, with a focus on creating a grounded, immersive survival experience. This prototype showcases the game's core mechanics, atmosphere, and design direction.",
      tools: "Unreal Engine 4, Adobe Photoshop, Blender, Figma",
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
      company: "Ana Neiva, Cory Webb",
      status: "Alpha Version",
      category: "Puzzle/Adventure",
      platform: [
        "PC",
      ],
      description: "Step into the pixelated shoes of a young boy who finds himself mysteriously trapped inside an old Game Boy console. From within the screen, he can still see the real world, but he no longer belongs to it. To escape, players must guide the boy through a series of surreal, game-inspired challenges that blur the line between reality and retro gameplay.",
      tools: "Unreal Engine 4, Adobe Photoshop, Blender, Figma, Assets from Unreal Marketplace",
      coverImage: "/images/projects/games/PixelEscape/Logo.png",
      coverAnimated: "/images/projects/games/PixelEscape/Gameplay1_GIF_Small.gif",
      videoUrl: "https://www.youtube.com/embed/DBvb68m_vlE?si=ZCFxf5Qhf0T475ZW",
      designurl: "https://anageek.itch.io/pixel-escape-o-enigma-de-lucas",
      designButtonLabel: "Download Game",
      sections: [
        {
          title: "Game Design Document",
          description: [
            { type: "heading", text: "Overview" },
            { type: "paragraph", text: "It's a unique adventure that combines elements of the real and virtual world in an innovative way. Players take on the role of a boy who finds himself trapped inside an old Game Boy console. While holding the Game Boy, he has a peripheral view of the 3D world around him, while on the Game Boy screen, he has a top view. -down which can be used as a map. The objective is to navigate the game's various levels, each representing an environment from the character's real life, and find a way to escape back to the real world. The journey is full of challenges, puzzles and dangers, but also clues that reveal the truth behind your virtual prison." },
            { type: "image", image: "/images/projects/games/PixelEscape/Cover.png" },

            { type: "heading", text: "Environment" },
            { type: "paragraph", text: "The game takes place in several rooms of a house full of riddles and dangers. Each room represents a unique challenge that Lucas must overcome to find the exit and escape the house. The house has a variety of rooms, such as the hallway, library, living room, kitchen, bedrooms, bathroom, basement and attic. Each room is a puzzle in itself, with hidden clues, security devices and obstacles to overcome. These challenges can involve finding hidden keys, deciphering codes, avoiding traps and manipulating objects to open a path. As Lucas explores the rooms, he discovers clues about his prison and the truth behind the alternate reality he is trapped in. The game's progression is non-linear, allowing players to choose the order in which they explore the rooms of the house. Each choice affects the story and the unfolding of events, providing a unique gaming experience for each player." },
            { type: "image", image: "/images/projects/games/PixelEscape/Game-Design-Plan.png" },

            { type: "heading", text: "Plot" },
            { type: "paragraph", text: "A young man named Lucas, a video game enthusiast who, on an ordinary afternoon, finds an old Game Boy console in the attic of his house. Fascinated by the retro device, Lucas decides to test it. Upon turning on the Game Boy, Lucas is suddenly sucked into the game and finds himself trapped inside the device's virtual world. He finds himself in a 2D, pixelated version of his own neighborhood, where all elements are represented as if they were inside the Game Boy.With the console in his hands, Lucas realizes that he has a peripheral view of the 3D world around him, while the Game Boy's screen shows a top-down view that works like a map. He soon realizes that to escape, he must navigate the game's various levels, each representing a real-life environment, and uncover the mysteries behind his virtual prison. During his journey, Lucas encounters strange characters and unexpected challenges, many of which are inspired by his own memories and life experiences. He discovers that, to escape the game, he must gather clues, solve puzzles and face increasingly complex challenges. As he progresses, Lucas discovers that his virtual prison is related to a mysterious event from his past, and he must uncover the truth behind this incident to find a way to return to the real world. With the help of unlikely allies and his determination, Lucas embarks on an epic journey to escape the Game Boy and discover his destiny. " },

            { type: "heading", text: "Art and Visual Style" },
            { type: "paragraph", text: "The 3D world around the character is represented with more cartoonish and stylized graphics, while the Game Boy screen displays a top-down view with a pixelated aesthetic and a limited color palette." },

            { type: "heading", text: "Target Platform" },
            { type: "paragraph", text: "The Game is developed for PC, taking advantage of graphics and processing resources to offer an engaging and immersive gaming experience." },

            { type: "heading", text: "Target Audience" },
            { type: "paragraph", text: "The game is aimed at players of all ages who enjoy puzzle challenges, exploration, and immersive narratives." },

            { type: "heading", text: "Main Game Mechanics" },
            { type: "paragraph", text: "Room exploration:" },
            {
              type: "list", items: [
                "Players have a view of the 3D world around them while holding the Gameboy and can walk, jump and interact with objects.",
                "On the Game Boy screen, they have a top-down view that can be used as a map to navigate rooms.",
              ]
            },
            { type: "paragraph", text: "Puzzle Solving:" },
            {
              type: "list", items: [
                "Each level presents unique puzzles and challenges that players must solve to advance.",
                "The puzzles are inspired by the character's real-life environments and require logical thinking and creativity to overcome.",
              ]
            },
            { type: "paragraph", text: "Using Game Boy Game Mechanics:" },
            {
              type: "list", items: [
                "Players use Game Boy-specific gameplay mechanics such as walking, jumping, interacting with objects, to progress through levels and overcome challenges.",
                "These mechanics can be controlled using the Game Boy's on-screen buttons.",
              ]
            },
            { type: "paragraph", text: "Immersive Narrative:" },
            {
              type: "list", items: [
                "The narrative is delivered through dialogue with non-playable characters and events in the game environment.",
                "As they progress through the game, players discover clues and information that help them understand why they are trapped inside the Game Boy and how to escape into real life",
              ]
            },
          ],
          image: "",
        },
      ],
      images: [
        "/images/projects/games/PixelEscape/AnimatedCover.gif",
        "/images/projects/games/PixelEscape/Collect-Gameboy.gif",
        "/images/projects/games/PixelEscape/Cut_Thunder-GIF.gif",
        "/images/projects/games/PixelEscape/Enter-Portal.gif",
        "/images/projects/games/PixelEscape/Image-1.png",
        "/images/projects/games/PixelEscape/Image-2.png",

      ],
    },
    //Pirate's Attack
    {
      id: 3,
      title: "Pirate's Attack",
      role: "Unreal Developer",
      company: "Ana Neiva",
      status: "Alpha Version",
      category: "Tower Defense",
      platform: [
        "PC",
      ],
      description: "It's a tower defense game, where you have to protect the king from the pirates. You have cannons, explosive barrels and barriers, and you can also upgrade your items. Try to survive and have fun! Click on the tower (middle of island) to start upgrading your items by consuming your points. You get points by every boat you sink. This is made for Crie seus jogos gamejam - Theme Infinity Loop",
      tools: "Unreal Engine 4, Adobe Photoshop, Blender, Figma",
      coverImage: "/images/projects/games/PiratesAttack/Thumbnail.png",
      coverAnimated: "/images/projects/games/PiratesAttack/AnimatedCover.png",
      videoUrl: "https://www.youtube.com/embed/_s-V_9SB6fs?si=OHAMfSQIR6by9zsl",
      designurl: "https://anageek.itch.io/pirates-attack",
      designButtonLabel: "Download Game",
      sections: [
        {
          title: "Project Overview",
          description: [
            { type: "heading", text: "Project Overview" },
            { type: "paragraph", text: "Pirate’s Attack is a tower defense game set on a tropical island under siege. Players strategically place cannons, barrels, and barriers to fend off waves of invading pirates. With each successful defense, players earn points they can use to upgrade their defenses and prepare for more intense attacks. The game was developed as a personal project to explore a new genre and experiment with reusing existing assets. It is currently in its alpha stage, with plans for further balancing and refinement based on early feedback." },
            { type: "image", image: "/images/projects/games/PiratesAttack/cover.png" },

            { type: "heading", text: "Project Duration" },
            { type: "paragraph", text: "The development took around 2 months" },

            { type: "heading", text: "Design Goals" },

            {
              type: "list", items: [
                "Explore a New Genre: I typically work in different genres, so this was an opportunity to break out of my usual patterns and apply my design knowledge to a tower defense setting.",
                "Asset Reuse: I challenged myself to build a compelling experience using assets I had already created or sourced.",
                "Inspired by Clash Royale: The real-time tension and upgrade mechanics of Clash Royale influenced my decisions around pacing and UI style.",
              ]
            },

            { type: "heading", text: "Target Audience" },
            { type: "paragraph", text: "While the target audience wasn't initially defined, the game appeals to:" },
            {
              type: "list", items: [
                "Strategy game enthusiasts who enjoy resource management and tactical gameplay.",
                "Casual PC gamers looking for short, engaging play sessions.",
                "Players who enjoy pirate-themed settings and light-hearted action.",
              ]
            },
            { type: "paragraph", text: "This insight will help shape marketing and polish priorities in future iterations." },





          ],
          image: "",
        },
        {
          title: "User Research",
          description: [
            { type: "heading", text: "User Testing" },
            { type: "paragraph", text: "I conducted informal playtests with friends, who provided valuable feedback on:" },
            {
              type: "list", items: [
                "Game pacing",
                "Upgrade effectiveness",
                "Visual clarity of enemy waves and defenses",
              ]
            },
            { type: "paragraph", text: "This feedback loop led to small but meaningful improvements in the core gameplay loop." },

          ],
          image: "/images/projects/games/PiratesAttack/acheta.png",
        },
        {
          title: "UI/Design Systems",
          description: [

            { type: "image", image: "/images/projects/games/PiratesAttack/UI Elements.png" },

          ],
          image: "",
        },
      ],
      images: [
        "/images/projects/games/PiratesAttack/Cannon Placement.gif",
        "/images/projects/games/PiratesAttack/Cannon test.gif",
        "/images/projects/games/PiratesAttack/Placement Mechanic.gif",
        "/images/projects/games/PiratesAttack/AnimatedCover.png",
        "/images/projects/games/PiratesAttack/img3.png",
        "/images/projects/games/PiratesAttack/img1.png",
        "/images/projects/games/PiratesAttack/img2.png",

      ],
    },
    //Joe's Christmas
    {
      id: 4,
      title: "Joe's Christmas",
      role: "Unreal Developer",
      company: "Ana Neiva",
      status: "Alpha Version",
      category: "Adventure",
      platform: [
        "PC",
      ],
      description: "Joe is curious boy, In christmas eve he was hidden and prepared to see the moment when Santa visits him.However something he didn't expect happenned.",
      tools: "Unreal Engine 4, Adobe Photoshop, Blender, Figma",
      coverImage: "/images/projects/games/JoesChristmas/Logo.png",
      coverAnimated: "/images/projects/games/JoesChristmas/AnimatedCover.jpg",
      videoUrl: "https://www.youtube.com/embed/5W_ecUMFbdw?si=iU7PF2j6ZGbwLOuW",
      designurl: "https://anageek.itch.io/joes-christmas",
      designButtonLabel: "Download Game",
      sections: [
        // {
        //   title: "Project Overview",
        //   description: [
        //     { type: "heading", text: "" },
        //     { type: "paragraph", text: ""},
        //   ],
        //   image: "",
        // },
      ],
      images: [
        "/images/projects/games/JoesChristmas/img-1.png",
        "/images/projects/games/JoesChristmas/img-2.png",

      ],
    },
  ],
  uiux: [
    //Ghosts of Tabor
    {
      id: 1,
      title: "Ghosts of Tabor",
      role: "UX/UI Artist",
      company: "Combat Waffle Studios",
      status: "Early Access",
      category: "VR FPS",
      platform: [
        "VR",
      ],
      description: "Ghosts of Tabor is VRs only FPS PVP and PVE survival game where you will use your wits, skills and resources to survive. Inspired by games such as Escape from Tarkov and DayZ, featuring different scenarios from scavenging to looting and crafting. Will you survive long enough to make it out alive?",
      tools: "Unreal Engine 4, Adobe Photoshop, Figma",
      coverImage: "/images/projects/uiux/GhostsOfTabor/Cover.png",
      coverAnimated: "/images/projects/uiux/GhostsOfTabor/AnimatedCover.gif",
      videoUrl: "https://www.youtube.com/embed/R_gKKFyLb9Y?si=9R0Brl8z0UhckDco",
      designurl: "https://store.steampowered.com/app/1957780/Ghosts_of_Tabor/",
      designButtonLabel: "Download Game",
      sections: [
        {
          title: "Project Overview",
          description: [
            { type: "heading", text: "Product" },
            { type: "paragraph", text: " " },

            { type: "heading", text: "Project Duration" },
            { type: "paragraph", text: "" },

            { type: "heading", text: "My Role" },
            { type: "paragraph", text: "" },
            {
              type: "list", items: [
                // "",
                
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
            { type: "paragraph", text: "" },

            { type: "heading", text: "Target Audience" },
            { type: "paragraph", text: "" },

            { type: "heading", text: "Benchmark" },
            { type: "paragraph", text: "" },
            {
              type: "list", items: [

              ]
            },
            { type: "image", image: "" },

          ],
          image: "",
        },
        {
          title: "Design",
          description: [
            { type: "heading", text: "Userflow" },
            { type: "paragraph", text: "" },

            { type: "heading", text: "Wireframes" },
            { type: "paragraph", text: "" },

            { type: "heading", text: "Mockups" },
            { type: "paragraph", text: "" },

            { type: "heading", text: "UI/Design System" },
            { type: "paragraph", text: "" },
            {
              type: "list", items: [

              ]
            },
            { type: "image", image: "" },

          ],
          image: "",
        },



      ],
      images: [
        //"",
        
      ],

    },
    //Polker
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
    //Kalyskah
    {
      id: 3,
      title: "Kalyskah",
      role: "Unreal Developer",
      company: "lobo",
      status: "Alpha Version",
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

    // {
    //   id: 1,
    //   title: "Title Placeholder",
    //   role: "Role Placeholder",
    //   company: "Personal Project",
    //   status: "Alpha Version",
    //   category: "Category Placeholder",
    //   platform: [
    //     "PC",
    //   ],
    //   description: "Description Placeholder",
    //   tools: "Tools Placeholder",
    //   coverImage: "placeholder.svg?height=400&width=600",
    //   coverAnimated: "placeholder.svg?height=400&width=600",
    //   sections: [
    //     {
    //       title: "teste",
    //       description: [
    //         { type: "heading", text: " " },
    //         { type: "paragraph", text: " " },
    //         {
    //           type: "list", items: [
    //             " ",

    //           ]
    //         },
    //         { type: "image", image: "" },
    //       ],
    //       image: "/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
    //     },
    //   ],
    //   images: [
    //     "placeholder.svg?height=400&width=600",
    //     "placeholder.svg?height=400&width=600",
    //   ],
    //   videoUrl: "",
    //   designurl: "https://anageek.github.io",
    //   designButtonLabel: "View Design Process",
    // },
  ],
  design: [

    //Placeholder
    // {
    //   id: 1,
    //   title: "Logo Design",
    //   role: "UX/UI ",
    //   company: "Personal Project",
    //   status: "Alpha Version",
    //   category: "Design",
    //   platform: [
    //     "",
    //   ],
    //   description: "Logo done for a twitch channel",
    //   tools: "Adobe Photoshop",
    //   coverImage: "/images/projects/design/Sousa/Portfolio.png",
    //   coverAnimated: "/images/projects/design/Sousa/Portfolio.png",
    //   sections: [
    //     {
    //       title: "teste",
    //       description: [
    //         { type: "heading", text: " " },
    //         { type: "paragraph", text: " " },
    //         {
    //           type: "list", items: [
    //             " ",

    //           ]
    //         },
    //         { type: "image", image: "" },
    //       ],
    //       image: "/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
    //     },
    //   ],
    //   images: [
    //     "/images/projects/design/Sousa/Portfolio.png",
    //   ],
    //   videoUrl: "",
    //   designurl: "https://anageek.github.io",
    //   designButtonLabel: "View Design Process",
    // },
  ],
};