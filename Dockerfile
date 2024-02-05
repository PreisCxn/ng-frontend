FROM nginx:1.19.0-alpine
COPY dist ./
COPY /dist/fe-pcxn-ng/browser /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
