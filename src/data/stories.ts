import { Story } from '../types';

export const STORIES: Story[] = [
  {
    id: 'story-whisperwood-cipher',
    title: 'The Cipher of Whisperwood Island',
    subtitle: 'Two young detectives uncover a forgotten stone monument deep inside an ancient pine forest.',
    genre: 'Mystery & Adventure',
    difficulty: 'intermediate',
    estimatedMinutes: 5,
    coverImage: '/src/assets/images/story_whisperwood_cipher_1790256656124.jpg',
    summary: 'When 11-year-old Nora and her brother Leo stumble upon a moss-covered monolith on Whisperwood Island, they must decode carved cryptographic symbols to reveal an ecological sanctuary safeguarded for centuries.',
    sections: [
      {
        chapterNumber: 1,
        chapterTitle: 'The Monolith in the Mist',
        content: `A thick morning mist clung to the mossy canopy of Whisperwood Island. Eleven-year-old Nora adjusted the strap of her brass compass, her curiosity ignited by an unusual geological reading on her handheld scanner. Her brother Leo knelt near the foot of an enormous pine, dusting away needles to reveal an ancient carved stone.

"Look here, Nora," Leo whispered, his flashlight catching a series of interlocking geometric rings. "The glyphs at the centre of the stone are glowing faintly with an iridescent blue colour."

Nora knelt beside him, running her fingertip over the engraved patterns. "This isn't an accidental formation. Someone took immense care to organise these symbols into a cryptographic matrix. The stone is a puzzle protecting a hidden subterranean chamber."`,
        highlightVocabularyIds: ['vocab-curiosity', 'vocab-centre', 'vocab-colour', 'vocab-organise', 'vocab-subterranean'],
      },
      {
        chapterNumber: 2,
        chapterTitle: 'Deciphering the Glyph Code',
        content: `To unlock the mechanism, the siblings needed to balance three counterweight dials set into the face of the monolith. Nora observed that the engravings mirrored astronomical constellations.

"The cipher requires someone who is responsible and observant," Nora noted, checking the azimuth. "If we misalign the dial, the locking pins could reset permanently. We must maintain our perseverance and double-check each coordinate."

Leo spotted a small inscription along the perimeter: 'Only those who honour the natural environment shall enter.' As he rotated the final dial into alignment, a soft hum reverberated through the stone floor. The monolith parted with an intricate click, unveiling a stone staircase descending into an underground botanical vault filled with endangered flora.`,
        highlightVocabularyIds: ['vocab-responsible', 'vocab-perseverance', 'vocab-honour', 'vocab-environment', 'vocab-intricate'],
      },
    ],
    vocabularyIds: [
      'vocab-curiosity',
      'vocab-centre',
      'vocab-colour',
      'vocab-organise',
      'vocab-subterranean',
      'vocab-responsible',
      'vocab-perseverance',
      'vocab-honour',
      'vocab-environment',
      'vocab-intricate',
    ],
    comprehensionQuestions: [
      {
        id: 'q1-whisperwood',
        question: 'What initially caught Nora and Leo’s attention at the ancient stone monolith?',
        options: [
          'A loud alarm ringing from the forest canopy',
          'Interlocking rings glowing with an iridescent blue colour at the centre',
          'A modern metal door with an electronic keypad',
          'A treasure chest left open under a pine tree',
        ],
        correctIndex: 1,
        explanation: 'Leo’s flashlight illuminated interlocking geometric rings at the centre of the stone glowing with a faint blue colour.',
      },
      {
        id: 'q2-whisperwood',
        question: 'What character trait did Nora emphasise was necessary to solve the cipher safely?',
        options: [
          'Brute strength to force open the stone gears',
          'Being fast and reckless to finish before sunset',
          'Being responsible, observant, and demonstrating perseverance',
          'Ignoring the instructions carved on the perimeter',
        ],
        correctIndex: 2,
        explanation: 'Nora pointed out that deciphering the dials required someone responsible, observant, and with perseverance so the pins would not reset.',
      },
      {
        id: 'q3-whisperwood',
        question: 'What was hidden behind the monolith once the locking mechanism clicked open?',
        options: [
          'A pile of gold coins and pirate jewels',
          'A modern computer server room',
          'An underground botanical vault safeguarding endangered flora',
          'A trap that locked the siblings inside a cave',
        ],
        correctIndex: 2,
        explanation: 'The inscription honoured the natural environment, leading to a botanical vault protecting rare and endangered plant species.',
      },
    ],
  },
  {
    id: 'story-abyssal-trench',
    title: 'The Abyssal Trench Expedition',
    subtitle: 'A high-tech submersible dives 6,000 metres into the ocean depths to investigate deep-sea bioluminescence.',
    genre: 'Marine Science & Exploration',
    difficulty: 'advanced',
    estimatedMinutes: 6,
    coverImage: '/src/assets/images/story_abyssal_trench_1790256666812.jpg',
    summary: 'Junior oceanographers dive aboard the research submarine Nautilus-VII into the Mariana Trench, testing a radical hypothesis about how deep-sea creatures communicate with luminous chemical signals.',
    sections: [
      {
        chapterNumber: 1,
        chapterTitle: 'Descent into the Midnight Zone',
        content: `At 4,000 metres beneath the surface, sunlight ceased to exist. Inside the titanium cabin of the submersible, twelve-year-old cadet Tariq peered through the reinforced quartz viewport. Outside, travelling through the pitch-black abyss, tiny flashes of azure and emerald sparkled in the dark.

"Notice the frequency of the pulses," Tariq said to Chief Scientist Dr. Alvarez. "Our hypothesis is that these siphonophores use luminous bioluminescence not just for hunting, but as an elaborate dialogue to warn neighbours of geothermal currents."

Dr. Alvarez nodded approvingly. "An extraordinary theory, Tariq. Let’s calibrate our optical sensors and monitor the thermal vents ahead."`,
        highlightVocabularyIds: ['vocab-travelling', 'vocab-hypothesis', 'vocab-luminous', 'vocab-dialogue', 'vocab-neighbour', 'vocab-extraordinary'],
      },
      {
        chapterNumber: 2,
        chapterTitle: 'The Hydrothermal Oasis',
        content: `As the submersible approached the ocean floor, the water temperature rose rapidly near a cluster of mineral chimneys. A colony of translucent glass shrimp swarmed around the vents. The exterior hull groaned under the immense water pressure, but the vessel's engineered defence held firm.

"Switch on the spectrum analyser," Tariq commanded, recording the light pulses. "Look at the rich amber colour of their photophores! It's unlike any organism documented in our marine catalogue."

The data confirmed their hypothesis: the luminous pulses fluctuated in rhythm with underwater seismic vibrations, demonstrating an unprecedented biological early-warning system. This historic expedition would provide crucial data to help marine biologists protect vulnerable ocean trenches from deep-sea mining.`,
        highlightVocabularyIds: ['vocab-defence', 'vocab-colour', 'vocab-expedition', 'vocab-environment'],
      },
    ],
    vocabularyIds: [
      'vocab-travelling',
      'vocab-hypothesis',
      'vocab-luminous',
      'vocab-dialogue',
      'vocab-neighbour',
      'vocab-extraordinary',
      'vocab-defence',
      'vocab-colour',
      'vocab-expedition',
      'vocab-environment',
    ],
    comprehensionQuestions: [
      {
        id: 'q1-abyssal',
        question: 'What was Tariq’s scientific hypothesis regarding deep-sea siphonophores?',
        options: [
          'They emit light solely to blind predators',
          'They use luminous bioluminescence as a dialogue to communicate warnings about geothermal currents',
          'They cannot survive in cold temperatures without sunlight',
          'They navigate using magnetic fields from sunken shipwrecks',
        ],
        correctIndex: 1,
        explanation: 'Tariq hypothesised that the creatures used luminous pulses as an elaborate dialogue to warn nearby neighbours about dangerous underwater currents.',
      },
      {
        id: 'q2-abyssal',
        question: 'Why was the submersible able to withstand the crushing pressure at the bottom of the trench?',
        options: [
          'It was made out of lightweight plastic',
          'It had an engineered titanium defence and reinforced quartz viewports',
          'The pressure at the ocean floor is lighter than on the surface',
          'It remained tethered to a floating raft above',
        ],
        correctIndex: 1,
        explanation: 'The vessel’s engineered titanium defence and quartz viewports successfully protected the crew against extreme water pressure.',
      },
      {
        id: 'q3-abyssal',
        question: 'How did the recorded light pulses help the scientists’ mission?',
        options: [
          'They proved the organisms responded rhythmically to seismic vibrations, aiding ocean conservation',
          'They blinded the ship cameras and ended the dive early',
          'They showed the trench was completely devoid of living creatures',
          'They allowed the submarine to run without battery power',
        ],
        correctIndex: 0,
        explanation: 'The data confirmed the rhythmic pulses were tied to seismic vibrations, yielding critical findings for marine conservation.',
      },
    ],
  },
  {
    id: 'story-kinetic-rover',
    title: 'The Kinetic Rover Derby',
    subtitle: 'A spirited youth engineering team races against the clock to build an autonomous solar vehicle.',
    genre: 'STEM & Teamwork',
    difficulty: 'beginner',
    estimatedMinutes: 4,
    coverImage: '/src/assets/images/story_kinetic_rover_1790256677955.jpg',
    summary: 'Ten-year-old inventor Kian and teammate Sophie must redesign their rover’s steering gear after a breakdown on trial day, learning that true sportsmanship and teamwork are just as vital as winning.',
    sections: [
      {
        chapterNumber: 1,
        chapterTitle: 'Disaster in the Pits',
        content: `Thirty minutes before the Junior Rover Derby kick-off, smoke wafted from team Apex’s workbench. Kian gasped as the main drive gear on their prototype rover, nicknamed "Starlight", slipped out of alignment.

"Don't panic," Sophie urged, reaching for the digital calliper. "Our favourite design feature—the modular chassis—was built specifically so we can repair parts swiftly. We just need to organise our replacement gears by ratio."

Kian took a deep breath. He knew acting in haste would ruin their chances. Being a responsible team captain meant staying calm when unexpected challenges arose.`,
        highlightVocabularyIds: ['vocab-favourite', 'vocab-organise', 'vocab-responsible', 'vocab-intricate'],
      },
      {
        chapterNumber: 2,
        chapterTitle: 'The Final Lap',
        content: `With minutes to spare, Sophie secured the brass axle directly through the centre of the differential housing. Kian applied a splash of synthetic lubricant and recalibrated the optical guidance sensors.

"Look at that smooth rotation," Kian beamed. "The rover’s defence against wheel drag is optimal now!"

When the green starter flag dropped, Starlight accelerated cleanly down the obstacle track. Navigating hairpin turns and sand humps, the rover crossed the finish line in first place. Yet Kian’s proudest moment was not hoisting the trophy—it was the honour of sharing the engineering medal with Sophie for their relentless perseverance.`,
        highlightVocabularyIds: ['vocab-centre', 'vocab-defence', 'vocab-honour', 'vocab-perseverance', 'vocab-curiosity'],
      },
    ],
    vocabularyIds: [
      'vocab-favourite',
      'vocab-organise',
      'vocab-responsible',
      'vocab-intricate',
      'vocab-centre',
      'vocab-defence',
      'vocab-honour',
      'vocab-perseverance',
      'vocab-curiosity',
    ],
    comprehensionQuestions: [
      {
        id: 'q1-rover',
        question: 'What breakdown occurred 30 minutes before the competition started?',
        options: [
          'The battery burst into flames',
          'The main drive gear on Starlight slipped out of alignment',
          'The team lost their blueprints on the bus',
          'The tires melted in the sun',
        ],
        correctIndex: 1,
        explanation: 'The main drive gear on their rover prototype slipped out of alignment, causing friction and smoke.',
      },
      {
        id: 'q2-rover',
        question: 'Why was the team able to repair the vehicle quickly?',
        options: [
          'They bought a brand new robot from the store',
          'They gave up and asked another school to drive for them',
          'Their favourite feature was a modular chassis engineered for quick part replacement',
          'The judges postponed the race until next week',
        ],
        correctIndex: 2,
        explanation: 'Sophie pointed out that their modular chassis design was built purposefully so damaged components could be replaced swiftly.',
      },
      {
        id: 'q3-rover',
        question: 'What was Kian’s proudest moment of the entire derby?',
        options: [
          'Receiving cash prize money for himself',
          'Defeating his rivals by crashing into their buggy',
          'The honour of sharing the engineering medal with Sophie for their teamwork and perseverance',
          'Selling his robot to a professional racing company',
        ],
        correctIndex: 2,
        explanation: 'Kian valued the honour of sharing the achievement with Sophie, celebrating their shared perseverance under pressure.',
      },
    ],
  },
];
