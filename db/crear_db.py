#!/usr/bin/python3.9

import os
import logging
import sys

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.addHandler(logging.StreamHandler(sys.stdout))
SCRIPT_NAME = "crear_db"

def main():
    logger.info("Creating database script")
    files = [
        "setup",
        "calificaciones_producto",
        "calificaciones_tienda",
        "compras",
        "entregas_en",
        "instituciones",
        "metodos_de_pago",
        "peticiones",
        "productos",
        "productos_en_tienda",
        "tiendas",
        "usuarios",
        "llaves_foraneas"
    ]

    logger.info(f"[1/{len(files) + 1}] Removing outdated script..");
    os.system(f"rm {SCRIPT_NAME}.sql")

    for i, file in enumerate(files):
        logger.info(f"[{i + 2}/{len(files) + 1}] Concatenating: {file}.sql")
        os.system(f"cat ./definiciones//{file}.sql >> {SCRIPT_NAME}.sql")

    logger.info(f"Created script {SCRIPT_NAME}")

if __name__ == '__main__':
    main()
