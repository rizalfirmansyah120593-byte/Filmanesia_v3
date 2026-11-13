const GENRE_LABELS = {
  movie: {
    28: 'Aksi',
    12: 'Petualangan',
    16: 'Animasi',
    35: 'Komedi',
    80: 'Kriminal',
    99: 'Dokumenter',
    18: 'Drama',
    10751: 'Keluarga',
    14: 'Fantasi',
    36: 'Sejarah',
    27: 'Horor',
    10402: 'Musik',
    9648: 'Misteri',
    10749: 'Romantis',
    878: 'Fiksi Ilmiah',
    10770: 'Televisi',
    53: 'Thriller',
    10752: 'Perang',
    37: 'Western',
    '-1': 'Anime',
    '-2': 'Thailand',
    '-3': 'Korea',
    '-4': 'China',
  },
  tv: {
    10759: 'Aksi dan Petualangan',
    16: 'Animasi',
    35: 'Komedi',
    80: 'Kriminal',
    99: 'Dokumenter',
    18: 'Drama',
    10751: 'Keluarga',
    10762: 'Anak',
    9648: 'Misteri',
    10764: 'Realitas',
    10765: 'Fiksi Ilmiah dan Fantasi',
    10766: 'Sinetron',
    37: 'Bincang-bincang',
    10767: 'Perang dan Politik',
    10768: 'Western',
    '-1': 'Anime',
    '-2': 'Drama Korea',
    '-3': 'Drama China',
    '-4': 'Donghua',
    '-5': 'Drama Thailand',
  },
};

export function getBrowseSeo(type, genre) {
  const isMovie = type === 'movie';
  const label = genre
    ? GENRE_LABELS[type][genre.id] || genre.name
    : null;
  const heading = !genre
    ? isMovie ? 'Film Populer Berbagai Genre' : 'Serial TV Populer Berbagai Genre'
    : isMovie
      ? `Film ${label}`
      : Number(genre.id) < 0
        ? label
        : `Serial TV ${label}`;
  const title = genre ? `${heading} Populer` : heading;
  const description = genre
    ? `Jelajahi ${heading.toLowerCase()} populer berdasarkan rating dan popularitas. Temukan pilihan tontonan di katalog Filmanesia.`
    : `Jelajahi ${isMovie ? 'film' : 'serial TV'} populer dari berbagai genre dan temukan pilihan tontonan di katalog Filmanesia.`;

  return { title, description, heading };
}
