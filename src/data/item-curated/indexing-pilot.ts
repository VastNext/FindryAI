// 仅记录官网可核实的选型信息；不将官网宣传语表述为本站实测结论。
export const indexingPilotNotes: Record<
  string,
  { title: string; points: string[]; source: string }
> = {
  kombai: {
    title: "When to choose Kombai",
    points: [
      "Kombai is aimed at teams designing websites and product interfaces while generating frontend code. Its site describes importing design decisions from a repository, Figma, Storybook, or an existing website; it is a closer fit for teams with an established UI than for someone looking only for a one-off image generator.",
      "Its canvas supports exploring variations before applying them to production code. Check whether your own components and design tokens carry through to the generated result before adopting it for an existing product.",
    ],
    source: "https://kombai.com/",
  },
  roomgpt: {
    title: "What RoomGPT is useful for",
    points: [
      "RoomGPT focuses on visualizing a redesign from a photo of a room. Its examples are useful for comparing possible looks before a renovation, rather than specifying measurements, materials, or a construction plan.",
      "If you need a buildable design, treat the generated image as a starting point and verify dimensions and feasibility separately. The product site presents room transformations, not an architectural specification workflow.",
    ],
    source: "https://www.roomgpt.io/",
  },
  musicfy: {
    title: "Choosing a Musicfy workflow",
    points: [
      "Musicfy offers different starting points: text-to-music for an original idea, uploaded vocals for a custom AI voice, and a library of voices for changing a song's vocal sound. Choose the route based on whether you already have a recording to work with.",
      "The product site distinguishes its copyright-free voice library from custom and parody voices. Verify the terms for the specific voice and your intended distribution before releasing a track; do not assume every voice has the same usage rights.",
    ],
    source: "https://musicfy.lol/",
  },
};
