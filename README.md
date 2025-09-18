# GAMES MS

## Dev

1. Clonar el repositorio
2. Instalar las dependencias con `npm install`
3. Crear el archivo `.env` basado en el archivo `.env.example`
4. Levantar el servidor de nast
```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```
5. Levantar el proyecto con `npm run start:dev`

## NATS

```
docker run -d --name nats-v -p 4222:4222 -p 8222:8222 nats
```

## Prod

1. Clonar el repositorio
2. Instalar las dependencias con `npm install`
3. Crear el archivo `.env` basado en el archivo `.env.example`
4. Levantar el servidor de nast
```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```
5. Ejecutar el comando para levantar la imagen de la aplicación en docker
```
docker build -f dockerfile.prod -t games-ms .
```

## NATS con Docker
```bash
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```

## PRISMA

```bash
# Aplicar migración inicial
npx prisma migrate dev && npx prisma generate

# Aplicar cambios ede esquema
npx prisma migrate dev --name <name-change>

```

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

### Estándares
- Seguir convenciones de TypeScript y NestJS
- Incluir tests para nuevas funcionalidades
- Documentar funciones complejas

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

Desarrollado por el equipo **Microservices-Lioo**.

## 📞 Soporte

Si tienes problemas o preguntas:

1. Busca en [Issues](https://github.com/Microservices-Lioo/event-bingo-ms/issues)
2. Crea un nuevo issue si es necesario

---

⭐ **¡Si este proyecto te es útil, dale una estrella en GitHub!**