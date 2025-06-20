
import type { DifficultyLevel } from "@/types";

export const simpleSampleTexts: string[] = [
  "The cat sat on the mat.",
  "A big red apple is good.",
  "My dog likes to run fast.",
  "Sun is hot in the summer.",
  "We play games after school.",
  "Birds can fly high in the sky.",
  "I like to read a fun book.",
  "The small car is blue.",
  "She helps her mom cook food.",
  "He kicks the ball in the park.",
  "Fish live in the water.",
  "The moon shines at night.",
  "I can count to ten.",
  "My friend has a new toy.",
  "We go to the zoo on Sunday."
];

export const intermediateSampleTexts: string[] = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
  "Programming is the art of telling another human being what one wants the computer to do.",
  "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune.",
  "The journey of a thousand miles begins with a single step. It does not matter how slowly you go as long as you do not stop.",
  "In the midst of chaos, there is also opportunity. The wise warrior avoids the battle.",
  "Simplicity is the ultimate sophistication. Learning never exhausts the mind.",
  "A computer once beat me at chess, but it was no match for me at kick boxing.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
  "Innovation distinguishes between a leader and a follower. Stay hungry. Stay foolish.",
  "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "The best way to predict the future is to create it. Do not wait for leaders; do it alone, person to person.",
  "Strive not to be a success, but rather to be of value. The mind is everything. What you think you become.",
  "What we think, we become. All that we are arises with our thoughts. With our thoughts, we make the world.",
  "Technology is just a tool. In terms of getting the kids working together and motivating them, the teacher is the most important."
];

export const expertSampleTexts: string[] = [
  "Supercalifragilisticexpialidocious, though the sound of it is something quite atrocious. If you say it loud enough, you'll always sound precocious.",
  "Existentialism can be incredibly daunting; articulating its nuanced philosophical underpinnings requires perspicacity and a comprehensive understanding of Søren Kierkegaard, Jean-Paul Sartre, and Albert Camus.",
  "The anthropomorphic personification of abstract concepts, such as Justice or Liberty, is a recurring motif in allegorical literature and neoclassical art, often imbued with symbolic accoutrements.",
  "Quantum entanglement describes a physical phenomenon that occurs when pairs or groups of particles are generated, interact, or share spatial proximity in ways such that the quantum state of each particle cannot be described independently of the state of the others, even when the particles are separated by a large distance.",
  "The Byzantine Empire, with its capital at Constantinople, preserved Greco-Roman cultural traditions for a millennium after the Western Roman Empire's collapse, significantly influencing Eastern European and Russian civilizations through its art, architecture, and Orthodox Christianity.",
  "Lexicographical analysis involves dissecting text into tokens, which are sequences of characters that represent a unit of meaning, a fundamental step in natural language processing and compiler design.",
  "Neuroplasticity, the brain's remarkable ability to reorganize itself by forming new neural connections throughout life, allows neurons (nerve cells) in the brain to compensate for injury and disease and to adjust their activities in response to new situations or to changes in their environment.",
  "Archaeologists meticulously excavate ancient sites, analyzing stratigraphy and artifacts to reconstruct past human societies, their economies, belief systems, and technological advancements, often facing challenges in preservation and interpretation.",
  "Cryptocurrency block-chains utilize complex cryptographic algorithms and distributed ledger technology to ensure transactional integrity and immutability without reliance on a central authorizing intermediary, thereby fostering decentralized financial ecosystems.",
  "Eschatological prophecies across various mythologies often depict cataclysmic events heralding the end of an era or the world, followed by a period of renewal or transformation, reflecting deep-seated human anxieties and hopes regarding cosmic destiny.",
  "The epistemological dichotomy between rationalism and empiricism has fundamentally shaped Western philosophy, influencing theories of knowledge acquisition, scientific methodology, and cognitive science for centuries.",
  "Photosynthesis, the intricate biochemical process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll pigment, is crucial for maintaining atmospheric oxygen levels and supplying energy for nearly all life on Earth.",
  "Sociolinguistics investigates the multifaceted relationship between language and society, exploring how linguistic features vary across different social groups and how language use reflects and shapes social identity, power dynamics, and cultural norms.",
  "The geopolitical ramifications of globalization, including increased economic interdependence, cultural homogenization, and transnational challenges such as climate change and pandemics, necessitate sophisticated multilateral cooperation and adaptive governance structures.",
  "Bioinformatics applies computational techniques to analyze vast biological datasets, such as genomic sequences and protein structures, accelerating discoveries in molecular biology, drug development, and personalized medicine through advanced algorithms and machine learning models."
];

export function getRandomText(level: DifficultyLevel): string {
  switch (level) {
    case "simple":
      return simpleSampleTexts[Math.floor(Math.random() * simpleSampleTexts.length)];
    case "intermediate":
      return intermediateSampleTexts[Math.floor(Math.random() * intermediateSampleTexts.length)];
    case "expert":
      return expertSampleTexts[Math.floor(Math.random() * expertSampleTexts.length)];
    default:
      return intermediateSampleTexts[Math.floor(Math.random() * intermediateSampleTexts.length)];
  }
}
