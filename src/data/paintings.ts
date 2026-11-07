export type Category = 'nature' | 'devotional' | 'calligraphy' | 'spiritual';

export const CATEGORY_LABELS: Record<Category, string> = {
  nature: 'Nature',
  devotional: 'Devotional',
  calligraphy: 'Calligraphy',
  spiritual: 'Spiritual',
};

export interface Painting {
  id: number;
  title: string;
  image: number;
  width: number;
  height: number;
  category: Category;
}

const paintings: Painting[] = [
  { id: 1, title: 'Art of Calligraphy', image: require('../../assets/images/art_of_caliography.jpg'), width: 312, height: 1184, category: 'calligraphy' },
  { id: 2, title: 'Devotional 5', image: require('../../assets/images/devotional_5.jpg'), width: 3031, height: 3580, category: 'devotional' },
  { id: 3, title: 'Devotional 6', image: require('../../assets/images/devotional_6.jpg'), width: 1312, height: 1680, category: 'devotional' },
  { id: 4, title: 'Devotional 7', image: require('../../assets/images/devotional_7.jpg'), width: 1252, height: 1084, category: 'devotional' },
  { id: 5, title: 'Devotional 8', image: require('../../assets/images/devotional_8.jpg'), width: 1212, height: 1648, category: 'devotional' },
  { id: 6, title: 'Devotional 9', image: require('../../assets/images/devotional_9.jpg'), width: 1284, height: 2188, category: 'devotional' },
  { id: 7, title: 'Devotional', image: require('../../assets/images/devotional.jpg'), width: 1320, height: 2328, category: 'devotional' },
  { id: 8, title: 'Music 360', image: require('../../assets/images/music_360.png'), width: 1150, height: 921, category: 'spiritual' },
  { id: 9, title: 'Nature 2', image: require('../../assets/images/nature_2.jpg'), width: 968, height: 1308, category: 'nature' },
  { id: 10, title: 'Nature 3', image: require('../../assets/images/nature_3.jpg'), width: 936, height: 1276, category: 'nature' },
  { id: 11, title: 'Nature 4', image: require('../../assets/images/nature_4.jpg'), width: 1344, height: 2384, category: 'nature' },
  { id: 12, title: 'Nature', image: require('../../assets/images/nature.jpg'), width: 1332, height: 1976, category: 'nature' },
  { id: 13, title: 'Spiritual 2', image: require('../../assets/images/spiritual_2.jpg'), width: 1304, height: 1340, category: 'spiritual' },
];

export const artistImage = require('../../assets/images/praveen.png');

export default paintings;
