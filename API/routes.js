const express = require('express');
const prisma = require('../prisma'); 
const router = express.Router();

router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: { playlists: true },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: +id },
      include: { playlists: true, },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (e) {
    next(e);
  }
});

router.get('/playlists', async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany({
      include: { tracks: true, },
    });
    res.json(playlists);
  } catch (e) {
    next(e);
  }
});

router.post('/playlists', async (req, res, next) => {
  try {
    const { name, description, ownerId, trackIds } = req.body;
    
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        owner: { connect: { id: +ownerId } }, 
        tracks: {
          connect: trackIds.map((id) => ({ id: +id })), 
        },
      },
      include: { tracks: true, },
    });
    
    res.status(201).json(playlist);
  } catch (e) {
    next(e);
  }
});

router.get('/playlists/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const playlist = await prisma.playlist.findUnique({
      where: { id: +id },
      include: { tracks: true, },
    });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json(playlist);
  } catch (e) {
    next(e);
  }
});

router.get('/tracks', async (req, res, next) => {
  try {
    const tracks = await prisma.track.findMany();
    res.json(tracks);
  } catch (e) {
    next(e);
  }
});

router.get('/tracks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const track = await prisma.track.findUnique({
      where: { id: +id },
    });

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    res.json(track);
  } catch (e) {
    next(e);
  }
});

module.exports = router;