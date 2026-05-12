# Personal Portfolio

Хувийн танилцуулга вэб сайт. HTML/CSS/JS frontend, Supabase backend, Vercel дээр deploy.

## Технологи
- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend / DB / Auth:** Supabase
- **Hosting:** Vercel

## Боломжууд
- Нүүр хуудас (тухай, ур чадвар, төслүүд, холбоо барих)
- Admin login
- Admin panel: projects, skills, contact messages CRUD

## Тохируулах

1. Supabase project үүсгээд `public/js/supabase.js` дотор `SUPABASE_URL` болон `SUPABASE_ANON_KEY`-г бөглөнө
2. SQL Editor дээр README дахь `schema.sql`-г ажиллуулна
3. Authentication → Users дээр admin хэрэглэгч үүсгэнэ
4. Authentication → Providers → Email доор `Enable Sign Ups` OFF болгоно

## Локалаар ажиллуулах

```bash
# public/ хавтасыг ямар ч static server дээр serve хийнэ. Жишээ нь:
npx serve public
# эсвэл
python3 -m http.server 8000 --directory public
```

## Deploy

Vercel-тэй GitHub repo-г холбоход автоматаар deploy хийгдэнэ. Root directory болгож `public` сонгоно.
