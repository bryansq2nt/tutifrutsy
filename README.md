# Tutifrutsy

Sitio web estatico para Tutifrutsy, un negocio local y familiar en Sterling, Virginia. El sitio esta hecho con HTML, CSS y JavaScript puro, sin frameworks ni proceso de build.

## Como abrir el sitio localmente

Puedes abrir `index.html` directamente en el navegador.

Tambien puedes levantar un servidor local desde esta carpeta:

```bash
python3 -m http.server 8000
```

Luego abre:

```text
http://localhost:8000
```

## Imagenes del sitio

El logo ya esta en:

```text
assets/logo.png
```

Las fotos principales estan en:

```text
assets/images/hero.jpg
assets/images/mango-preparado.jpg
assets/images/minuta.jpg
assets/images/fruta-fresca.jpg
assets/images/agua-coco.jpg
assets/images/jugo-cana.jpg
assets/images/pan-dulce.jpg
assets/images/trailer.jpg
```

Puedes reemplazar cada archivo manteniendo el mismo nombre. Asi no tienes que cambiar el HTML.

Notas:

- `hero.jpg` fue creado en formato panoramico a partir de una foto real del stand.
- `agua-coco.jpg` y `jugo-cana.jpg` usan fotos reales del puesto como apoyo visual. Si luego tienes fotos exactas de agua de coco o jugo de caña, reemplaza esos archivos con el mismo nombre.
- `pan-dulce.jpg` usa una foto real de snacks/antojitos. Si luego tienes foto exacta de pan dulce, reemplaza ese archivo con el mismo nombre.

## Donde cambiar el link de Google Maps

Busca este link en `index.html`:

```text
https://www.google.com/maps/search/?api=1&query=46859%20Leesburg%20Pike%2C%20Sterling%2C%20VA%2020164
```

Reemplazalo por el link final de Google Maps si quieres usar una URL especifica del negocio.

## Como reemplazar o agregar videos de TikTok

En `index.html`, busca la seccion:

```html
<section class="section tiktok-section" id="tiktok">
```

Cada video esta dentro de un bloque:

```html
<blockquote class="tiktok-embed" cite="URL_DEL_VIDEO" data-video-id="ID_DEL_VIDEO">
```

Para reemplazar un video:

1. Cambia el valor de `cite`.
2. Cambia el `href` dentro del enlace.
3. Cambia `data-video-id` por el ID del video, que es el numero final de la URL de TikTok.

Para agregar otro video, duplica uno de esos bloques y cambia la URL y el ID.

## Como subirlo a un hosting estatico

Sube estos archivos y carpetas a tu hosting:

```text
index.html
styles.css
script.js
robots.txt
sitemap.xml
llms.txt
llms-full.txt
b8f6e1b7d2a5469aa9c01f2d7f1e6a43.txt
assets/
```

Este sitio puede publicarse en cualquier hosting estatico como Netlify, Cloudflare Pages, GitHub Pages, Vercel en modo estatico, cPanel o cualquier servidor que sirva archivos HTML.

## SEO, GEO y crawlers de IA

El sitio incluye:

- `robots.txt` con acceso permitido para buscadores principales y crawlers de IA como `OAI-SearchBot`, `GPTBot`, `ChatGPT-User` y `Google-Extended`.
- `sitemap.xml` con la pagina principal y los archivos legibles para LLMs.
- `llms.txt` y `llms-full.txt` con una version limpia del contenido para asistentes de IA.
- JSON-LD en `index.html` para describir el negocio, ubicacion, horario, productos y redes sociales.

Antes de publicar, corre:

```bash
python3 scripts/seo_audit.py
```

La auditoria revisa que la meta description no pase de 160 caracteres, que existan canonical, Open Graph, Twitter cards, JSON-LD, robots, sitemap y archivos LLM.

## IndexNow

El archivo `b8f6e1b7d2a5469aa9c01f2d7f1e6a43.txt` permite verificar el sitio con IndexNow. Despues de publicar y confirmar que `https://tutifrutsy.com/b8f6e1b7d2a5469aa9c01f2d7f1e6a43.txt` abre correctamente, puedes avisar a IndexNow/Bing que las URLs cambiaron:

```bash
python3 scripts/submit_indexnow.py --from-sitemap
```

Para probar sin enviar:

```bash
python3 scripts/submit_indexnow.py --from-sitemap --dry-run
```

## Release deploy automatico

Para publicar cambios, usa el flujo completo:

```bash
python3 scripts/release_deploy.py -m "chore: update Tutifrutsy site"
```

Ese comando hace todo en orden:

1. Corre `scripts/seo_audit.py`.
2. Hace `git add -A`, commit y push.
3. Ejecuta el deploy FTP.
4. Verifica en produccion `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt` y la key de IndexNow.
5. Llama a IndexNow con las URLs del sitemap.

Si el repo no tiene remote de Git, si el push falla, si el deploy falla, o si la verificacion publica falla, el flujo se detiene antes de llamar IndexNow.
