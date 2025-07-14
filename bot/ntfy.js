const PocketBase = require('pocketbase');
const fetch = require('node-fetch');
const schedule = require('node-schedule');

const pb = new PocketBase('https://pb.wama.zbiorki.zs1mm.edu.pl');

const topic = "testowe";
const topic_url = `https://ntfy.sh/${topic}`;
const message = "Przypominam o opłaceniu zaległych zbiórek!!!";

async function wyslijPowiadomienie(tytul, wiadomosc) {
    try {
        const response = await fetch(topic_url, {
            method: 'POST',
            headers: {
                'Title': tytul,
                'Priority': '5',
                'Tags': 'rotating_light,rotating_light,rotating_light',
                'Click': 'https://www.youtube.com/watch?v=QMy14rGmpFI&t=101s'
            },
            body: wiadomosc
        });

        if (response.ok) {
            console.log("Powiadomienie wysłane pomyślnie");
        } else {
            console.error("Nie udało się wysłać powiadomienia:", response.statusText);
        }
    } catch (error) {
        console.error("Błąd podczas wysyłania powiadomienia:", error);
    }
}

schedule.scheduleJob('11 8 * * *', () => {
    wyslijPowiadomienie("Przypomnienie o zbiórce", message);
});

async function nasluchujPocketBase() {
    try {
        console.log('Subskrypcja kolekcji PocketBase rozpoczęta...');

        pb.collection('Zbiorki').subscribe('*', (e) => {
            console.log('Otrzymano nowe zdarzenie:', e);
            if (e.action === 'create') {
                const rekord = e.record;
                const tytul = 'Nowa zbiórka została utworzona!';
                const wiadomosc = `Nazwa: ${rekord.nazwa}\nOpis: ${rekord.opis}`;
                wyslijPowiadomienie(tytul, wiadomosc);
            }
        });
    } catch (error) {
        console.error('Błąd podczas subskrypcji PocketBase:', error);
    }
}

nasluchujPocketBase();