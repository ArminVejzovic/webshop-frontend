# webshop-frontend

Frontend for webshop app

Backend aplikacija za webshop sistem, razvijena u sklopu tehničkog dijela selekcijskog procesa za firmu **Neptis Space**.

## Tehnologije

- React.js

- TailwindCSS

- Axios manipulisanje podacima sa API-ja

- Retool API za cuvanje podataka

## API

Aplikacija koristi dva REST API-ja za upravljanje podacima

  /articles API

  Ovaj API služi za dohvat i upravljanje artiklima koji su dostupni u web shopu. Svaki artikal ima jedinstveni ID, naziv, cijenu, količinu, sliku, opis i datum kreiranja.

  [
    {
      "id": 23,
      "name": "Set Tanjira",
      "price": 19.99,
      "quantity": 20,
      "image_url": "https://cdn.pixabay.com/photo/2016/05/08/15/39/icon-1379313_1280.png",
      "created_at": "2025-07-26T19:32:23.853Z",
      "description": "Set Tanjira 6 komada"
    }
  ]

Polja:

  id: Jedinstveni identifikator artikla

  name: Naziv artikla

  price: Cijena artikla (decimalni broj)

  quantity: Dostupna količina na stanju

  image_url: Link ka slici artikla

  created_at: Datum i vrijeme kada je artikal kreiran

  description: Kratki opis artikla


  /orders API

  Ovaj API omogućava kreiranje i pregled narudžbi korisnika. Svaka narudžba sadrži listu artikala, status, informacije o kupcu i vremena obrade.

[
  {
    "id": 33,
    "items": "23, 23, 24",
    "status": "Rejected",
    "created_at": "7/29/2025, 3:45:00 PM",
    "processed_at": "2025-07-29T13:47:05.179Z",
    "customer_email": "armin.vejzovic@gmail.com",
    "customer_phone": "+3234432432",
    "customer_address": "Adresa Armin 123",
    "customer_lastname": "Vejzovic",
    "customer_firstname": "Armin"
  },
]

Polja:

  id: Jedinstveni identifikator narudžbe

  items: String s ID-jevima artikala iz narudžbe, odvojenim zarezima

  status: Trenutni status narudžbe (Processing, Accepted, Rejected, Finished)

  created_at: Vrijeme kada je narudžba kreirana (format može varirati)

  processed_at: Vrijeme kada je narudžba obrađena (može biti null ako nije još obrađena)

  customer_email: Email kupca

  customer_phone: Broj telefona kupca

  customer_address: Adresa kupca

  customer_lastname: Prezime kupca

  customer_firstname: Ime kupca

Za pravilno funkcionisanje aplikacije potrebno je da oba API-ja budu implementirana i dostupna, jer:

  /articles omogućava prikaz proizvoda i dodavanje u korpu,

  /orders omogućava slanje narudžbi i praćenje njihovog statusa.


## Funkcionalnosti

Admin Dashboard

Dostupan samo putem autentikacije (username i password). Nakon prijave admin ima pristup sljedećim stranicama:

    Početna (Popis artikala)

        Prikaz svih dostupnih proizvoda

        Filtriranje po: nazivu, cijeni i količini

        Sortiranje po datumu objave (ASC/DESC)

    Dodavanje novog artikla

        Forma za unos naziva, slike (URL), opisa, količine i cijene

    Detalji artikla

        Prikaz svih informacija o artiklu

        Mogućnost izmjene i brisanja artikla

    Pregled narudžbi

        Prikaz svih narudžbi s paginacijom

        Sortiranje po datumu

    Detalji narudžbe i status

        Prikaz detalja pojedinačne narudžbe

        Mogućnost izmjene statusa narudžbe:

            Prihvaćeno (u pripremi)

            Odbijeno

            Završeno

    Podešavanja + Logout

        Mogućnost odjave i osnovna navigacija

🛍️ Webshop (Gost – Guest)

Dostupan bez autentikacije. Gost korisnik ima pristup sljedećim funkcionalnostima:

    Početna stranica

        Prikaz svih dostupnih artikala

        Filtriranje i sortiranje (kao kod admina)

        Statusna traka s nazivom projekta

    Detalji artikla

        Prikaz slike, opisa, cijene, dostupne količine

        Dugme za dodavanje u košaricu

    Košarica

        Pregled svih odabranih artikala

        Ažuriranje količina i uklanjanje iz košarice

    Kreiranje narudžbe

        Forma za unos ličnih podataka (ime, prezime, adresa, telefon, email)

        Slanje narudžbe na backend sistem

💻 Tehničke karakteristike

    Tehnologija: React.js + Tailwind CSS

    Routing: Dvije odvojene rute za admin i kupca

    Responzivnost: Aplikacija je u potpunosti responzivna i prilagođena za rad na desktopu, tabletima i mobilnim uređajima

    Deploy: Aplikacija je deployana na besplatni hosting servis

## Tipovi korisnika

- Admin

- Kupac (Guest)

## Pokretanje projekta

1. Kloniraj repozitorij:
   ```bash
   git clone https://github.com/ArminVejzovic/webshop-frontend.git
   cd frontend

2. Instaliraj zavisnosti

   npm install

3. Kreiraj .env fajl u root direktoriju sa sljedećim sadržajem

  VITE_BACKEND_URL=<your_backend_url>
  
  VITE_API_URL_ARTICLES=<yout_api_url_articles>
  
  VITE_API_URL_ORDERS=<yout_api_url_orders>

4. Pokreni razvojni server:

   npm run dev

5. Otvori u browseru:

   http://localhost:5173

## Kontakt
  
  Autor: Armin Vejzović
  
  Email: 29armin.vejzovic@gmail.com

















