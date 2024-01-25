# Verwenden Sie ein offizielles Nginx-Image als Basis
FROM nginx:1.19.0-alpine

# Kopieren Sie den dist-Ordner in das Nginx-Verzeichnis
COPY /dist/fe-pcxn-ng/browser /usr/share/nginx/html
