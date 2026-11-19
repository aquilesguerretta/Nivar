import csv
import io

import pytest

from app.services.argos_ons_capacidade_geracao_diff import EXPECTED_HEADER


@pytest.fixture
def truncated_ons_capacity_pair():
    """Well-formed 101.25 MW capture and a successor truncated inside its last field."""
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=EXPECTED_HEADER, delimiter=";")
    writer.writeheader()
    writer.writerow({
        "nom_usina": "TEST SITE",
        "ceg": "UHE.PH.PA.030354-2.01",
        "cod_equipamento": "TEST-NIV65-UG01",
        "num_unidadegeradora": "01",
        "val_potenciaefetiva": "101.25",
    })
    valid = output.getvalue().encode("utf-8")
    return valid, valid.rsplit(b";", 1)[0] + b';"10'
