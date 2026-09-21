import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    ai,
    ancillary,
    argos_signal_inspection,
    ariadne_operator,
    atlas,
    atlas_world,
    auth,
    conta_luz,
    conversations,
    diagnostico,
    energy,
    fuel_mix,
    lmp,
    news,
    outages_v2,
    products,
    progress,
    reserve_margin,
    solar_proposal,
    spark_spread,
    stream,
    weather,
)
from app.routers.infra import router as infra_router
from app.services.pjm_stream import HUB


@asynccontextmanager
async def lifespan(app: FastAPI):
    await HUB.start()
    try:
        yield
    finally:
        await HUB.stop()


app = FastAPI(title="GridAlpha API", version="2.0", lifespan=lifespan)

_cors_origins = [
    "https://gridalpha.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]
_extra = os.environ.get("CORS_ORIGINS", "").strip()
if _extra:
    _cors_origins.extend(x.strip() for x in _extra.split(",") if x.strip())

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    # Vercel previews + any localhost/127.0.0.1 port (Vite falls back when 5173 is busy)
    allow_origin_regex=(
        r"https://.*\.vercel\.app|http://localhost:\d+|http://127\.0\.0\.1:\d+"
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Peregrine + Sprint 3B/3C intelligence (legacy, frozen).
app.include_router(news.router)  # /api/news/*
app.include_router(atlas.router)  # /api/atlas/*
app.include_router(energy.router)  # /api/energy/*
app.include_router(weather.router)  # /api/weather/*
app.include_router(ai.router)  # /api/ai/*

# Wave 5 canonical endpoints (see docs/v2-backend-contract.md).
app.include_router(lmp.router)  # /api/lmp/*
app.include_router(spark_spread.router)  # /api/spark-spread/*
app.include_router(fuel_mix.router)  # /api/fuel-mix/*
app.include_router(reserve_margin.router)  # /api/reserve-margin/*
app.include_router(outages_v2.router)  # /api/outages/*
app.include_router(ancillary.router)  # /api/ancillary/*
app.include_router(stream.router)  # /api/stream (SSE)
app.include_router(infra_router)  # /api/infra/* (Wave 7 static infrastructure)

# Wave 9 platform identity — one account per person, activation per product.
app.include_router(auth.router)  # /api/auth/*
app.include_router(products.router)  # /api/products/*

# Wave 10 world atlas — real Our World in Data country energy profiles.
app.include_router(atlas_world.router)  # /api/atlas/world/*

# Wave 11 progress — per-account lesson/badge/streak tracking, event-logged.
app.include_router(progress.router)  # /api/progress/*

# Conta de Luz Express Wave 2 — authenticated intake and manual delivery.
app.include_router(conta_luz.router)  # /api/conta-luz-express/*

# Solar Proposal Validator Wave 2 — sibling Advisory intake and delivery.
app.include_router(solar_proposal.router)  # /api/solar-proposal-validator/*

# Diagnóstico Energético Wave 2 — structured scoping intake (not a file upload).
app.include_router(diagnostico.router)  # /api/diagnostico-energetico/*

# Diagnóstico Energético Wave 2 — human messaging (any entitled product).
app.include_router(conversations.router)  # /api/conversations/*
app.include_router(conversations.operator_router)  # /api/operator/conversations/*

# NIV-48 Ariadne operator instrument — authenticated, workspace-scoped Core access.
app.include_router(ariadne_operator.router)  # /api/operator/ariadne/*

# NIV-52 Argos Signal inspection — authenticated, read-only, server-owned scenarios.
app.include_router(argos_signal_inspection.router)  # /api/operator/argos/ons-capacidade/*


@app.get("/health")
def health():
    return {"status": "ok"}
