// Test script for SoundCloud URL extraction
const { extractSoundCloudTrackPath } = require('./src/utils/mediaUtils.ts');

// Test URLs
const testUrls = [
  'https://soundcloud.com/forss/flickermood',
  'https://soundcloud.com/artist/track-name',
  'https://soundcloud.com/artist',
  'http://soundcloud.com/forss/flickermood',
  'https://www.soundcloud.com/forss/flickermood'
];

console.log('🧪 Testing SoundCloud URL extraction...\n');

testUrls.forEach(url => {
  const result = extractSoundCloudTrackPath(url);
  console.log(`URL: ${url}`);
  console.log(`Result: ${result}`);
  console.log('---');
});

console.log('\n✅ Test completed!');
