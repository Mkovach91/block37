const prisma = require("../prisma");

const seed = async () => {
  const users = Array.from({ length: 5 }, (_, i) => ({
    username: `User${i + 1}`,
  }));
  await prisma.user.createMany({ data: users });

  const tracks = Array.from({ length: 20 }, (_, i) => ({
    name: `Track ${i + 1}`,
  }));
  await prisma.track.createMany({ data: tracks });

  for (let i = 0; i < 15; i++) {
    const trackCount = 1 + Math.floor(Math.random() * 5); 
    const selectedTracks = Array.from({ length: trackCount }, () => ({
      id: 1 + Math.floor(Math.random() * 20),
    }));

    await prisma.playlist.create({
      data: {
        name: `Playlist ${i + 1}`,
        description: `Description for Playlist ${i + 1}`,
        owner: { connect: { id: 1 + Math.floor(Math.random() * 5) }, },
        tracks: { connect: selectedTracks, },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });