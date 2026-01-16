/**
 * 동적 sitemap 생성 스크립트
 *
 * 사용법:
 * 1. 백엔드 서버가 실행 중인지 확인
 * 2. 명령어 실행: node scripts/generateSitemap.js
 * 3. public/sitemap.xml이 자동 생성됨
 *
 * 주의: 이 스크립트는 정적 페이지와 동적 case 페이지를 모두 포함합니다.
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://mejudge.com';
const API_URL = 'https://mejudge-back.onrender.com';

// 정적 페이지 목록
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/main', priority: '0.9', changefreq: 'daily' },
  { url: '/rank', priority: '0.7', changefreq: 'daily' },
  { url: '/login', priority: '0.5', changefreq: 'yearly' },
  { url: '/signup', priority: '0.5', changefreq: 'yearly' },
];

async function fetchAllCases() {
  try {
    const response = await fetch(`${API_URL}/api/cases?limit=1000`);
    const data = await response.json();
    return data.cases || [];
  } catch (error) {
    console.error('Error fetching cases:', error);
    return [];
  }
}

function generateSitemapXML(staticPages, dynamicCases) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';

  // 정적 페이지 추가
  staticPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}${page.url}</loc>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += '  </url>\n\n';
  });

  // 동적 case 페이지 추가
  dynamicCases.forEach(caseItem => {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}/case/${caseItem._id}</loc>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += '  </url>\n\n';
  });

  xml += '</urlset>';
  return xml;
}

async function main() {
  console.log('🚀 Sitemap 생성 시작...');

  // 1. 모든 case 가져오기
  console.log('📦 사건 목록 가져오는 중...');
  const cases = await fetchAllCases();
  console.log(`✅ ${cases.length}개의 사건을 찾았습니다.`);

  // 2. sitemap XML 생성
  console.log('📝 Sitemap XML 생성 중...');
  const sitemapContent = generateSitemapXML(staticPages, cases);

  // 3. public/sitemap.xml에 저장
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemapContent, 'utf-8');

  console.log(`✅ Sitemap이 생성되었습니다: ${outputPath}`);
  console.log(`📊 총 ${staticPages.length + cases.length}개의 URL이 포함되었습니다.`);
  console.log('🎉 완료!');
}

main().catch(console.error);
