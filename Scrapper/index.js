import axios from 'axios';
import * as cheerio from 'cheerio';

const URL = 'https://www.gov.pl/web/bip/najnowsze-ogloszenia'; 

async function scrapeGovPl() {
    try {
        const { data } = await axios.get(URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const ogloszenia = [];

        $('li').each((index, element) => {
         
            const tytul = $(element).find('a').text().trim();
            const link = $(element).find('a').attr('href');

            if (tytul && tytul.length > 20 && link && link.includes('/web/')) {
                ogloszenia.push({
                    Id: ogloszenia.length + 1,
                    'Oficjalny Komunikat RP': tytul
                });
            }
        });

        if (ogloszenia.length > 0) {
            console.log(`\n--- Pobrano oficjalne ogłoszenia z portalu GOV.pl ---`);
            console.table(ogloszenia.slice(0, 15));
        } else {
            console.log('\nGov.pl również zwrócił pustą listę. Uruchamiam absolutnie niezawodną alternatywę...');
            await scrapeLegendarneWyko();
        }

    } catch (error) {
        console.error('Wystąpił błąd podczas pobierania danych:', error.message);
    }
}

async function scrapeLegendarneWyko() {
    try {
        const { data } = await axios.get('https://wykop.pl/');
        const $ = cheerio.load(data);
        const znaleziska = [];

        $('h2').each((index, element) => {
            const tytul = $(element).text().trim();
            if (tytul && tytul.length > 15 && znaleziska.length < 15) {
                znaleziska.push({
                    Id: znaleziska.length + 1,
                    'Gorący temat z Polski (Wykop)': tytul
                });
            }
        });

        console.log(`\n--- Pobrano najnowsze tematy z polskiego internetu ---`);
        console.table(znaleziska);
    } catch (e) {
        console.log('Błąd alternatywy:', e.message);
    }
}

scrapeGovPl();