"""Deterministic demonstration service for PUSHPAK Milestone 1 Dashboard.

All data returned is deterministic in-memory demonstration data with fixed snapshot timestamps.
No statistical engine, live scraping, or production database queries are performed.
"""

from typing import List, Optional
from app.schemas.dashboard import (
    DashboardSummaryResponse,
    TimeseriesPoint,
    DashboardTimeseriesResponse,
    RouteMover,
    DashboardMoversResponse,
    RouteBasketItem,
    DashboardRoutesResponse,
    HorizonItem,
    DashboardHorizonsResponse,
    CarrierComparisonItem,
    DashboardCarriersResponse,
    SurveillanceAlertItem,
    DashboardAlertsResponse,
)

FIXED_SNAPSHOT_TIME = "2026-09-04T18:30:00Z"

# 50 Strategic Domestic Corridors Demonstration Basket
# Validated: unique IDs, origin != dest, exactly 50 corridors.
CORRIDORS_DATA = [
    # Metro-to-Metro (16 Corridors)
    {"id": "DEL-BOM", "orig": "DEL", "dest": "BOM", "sec": "Metro-Metro", "km": 1148, "flt": 78, "avg": 5850, "t1": 11200, "t7": 6850, "t15": 5400, "t30": 4650, "t45": 4200, "chg": 5.4, "vol": "High (18.4%)", "qual": "HIGH OBSERVATION", "stat": "Surveillance Active", "base": 4680, "tax": 585, "apt": 410, "aux": 175},
    {"id": "BOM-DEL", "orig": "BOM", "dest": "DEL", "sec": "Metro-Metro", "km": 1148, "flt": 76, "avg": 5790, "t1": 10900, "t7": 6700, "t15": 5350, "t30": 4590, "t45": 4180, "chg": 4.8, "vol": "High (17.2%)", "qual": "HIGH OBSERVATION", "stat": "Surveillance Active", "base": 4630, "tax": 579, "apt": 410, "aux": 171},
    {"id": "DEL-BLR", "orig": "DEL", "dest": "BLR", "sec": "Metro-Metro", "km": 1740, "flt": 54, "avg": 6920, "t1": 13400, "t7": 8100, "t15": 6450, "t30": 5600, "t45": 5100, "chg": 4.1, "vol": "Moderate (12.8%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 5530, "tax": 692, "apt": 520, "aux": 178},
    {"id": "BLR-DEL", "orig": "BLR", "dest": "DEL", "sec": "Metro-Metro", "km": 1740, "flt": 54, "avg": 6880, "t1": 13150, "t7": 7950, "t15": 6400, "t30": 5550, "t45": 5050, "chg": 3.7, "vol": "Moderate (12.1%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 5500, "tax": 688, "apt": 520, "aux": 172},
    {"id": "BOM-BLR", "orig": "BOM", "dest": "BLR", "sec": "Metro-Metro", "km": 842, "flt": 48, "avg": 4420, "t1": 8900, "t7": 5100, "t15": 4150, "t30": 3650, "t45": 3300, "chg": 2.3, "vol": "Low (8.4%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 3530, "tax": 442, "apt": 310, "aux": 138},
    {"id": "BLR-BOM", "orig": "BLR", "dest": "BOM", "sec": "Metro-Metro", "km": 842, "flt": 48, "avg": 4390, "t1": 8800, "t7": 5050, "t15": 4120, "t30": 3620, "t45": 3280, "chg": 1.9, "vol": "Low (8.1%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 3510, "tax": 439, "apt": 310, "aux": 131},
    {"id": "MAA-BOM", "orig": "MAA", "dest": "BOM", "sec": "Metro-Metro", "km": 1033, "flt": 36, "avg": 4860, "t1": 9800, "t7": 5600, "t15": 4500, "t30": 3950, "t45": 3600, "chg": 3.2, "vol": "Moderate (11.6%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 3880, "tax": 486, "apt": 345, "aux": 149},
    {"id": "BOM-MAA", "orig": "BOM", "dest": "MAA", "sec": "Metro-Metro", "km": 1033, "flt": 36, "avg": 4810, "t1": 9700, "t7": 5550, "t15": 4460, "t30": 3910, "t45": 3580, "chg": 2.8, "vol": "Moderate (11.2%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 3840, "tax": 481, "apt": 345, "aux": 144},
    {"id": "DEL-HYD", "orig": "DEL", "dest": "HYD", "sec": "Metro-Metro", "km": 1256, "flt": 42, "avg": 5410, "t1": 10450, "t7": 6300, "t15": 5050, "t30": 4350, "t45": 3900, "chg": 1.8, "vol": "Low (7.9%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 4320, "tax": 541, "apt": 390, "aux": 159},
    {"id": "HYD-DEL", "orig": "HYD", "dest": "DEL", "sec": "Metro-Metro", "km": 1256, "flt": 42, "avg": 5380, "t1": 10350, "t7": 6250, "t15": 5010, "t30": 4320, "t45": 3880, "chg": 1.5, "vol": "Low (7.6%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 4300, "tax": 538, "apt": 390, "aux": 152},
    {"id": "CCU-DEL", "orig": "CCU", "dest": "DEL", "sec": "Metro-Metro", "km": 1307, "flt": 38, "avg": 5740, "t1": 11600, "t7": 6750, "t15": 5350, "t30": 4600, "t45": 4150, "chg": -0.8, "vol": "Moderate (10.2%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 4590, "tax": 574, "apt": 415, "aux": 161},
    {"id": "DEL-CCU", "orig": "DEL", "dest": "CCU", "sec": "Metro-Metro", "km": 1307, "flt": 38, "avg": 5690, "t1": 11400, "t7": 6680, "t15": 5300, "t30": 4580, "t45": 4120, "chg": -0.4, "vol": "Moderate (9.8%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 4550, "tax": 569, "apt": 415, "aux": 156},
    {"id": "HYD-BLR", "orig": "HYD", "dest": "BLR", "sec": "Metro-Metro", "km": 501, "flt": 28, "avg": 3620, "t1": 7400, "t7": 4250, "t15": 3400, "t30": 2950, "t45": 2700, "chg": 0.9, "vol": "Low (6.4%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2890, "tax": 362, "apt": 245, "aux": 123},
    {"id": "BLR-HYD", "orig": "BLR", "dest": "HYD", "sec": "Metro-Metro", "km": 501, "flt": 28, "avg": 3580, "t1": 7300, "t7": 4200, "t15": 3370, "t30": 2920, "t45": 2680, "chg": 0.6, "vol": "Low (6.1%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2860, "tax": 358, "apt": 245, "aux": 117},
    {"id": "DEL-MAA", "orig": "DEL", "dest": "MAA", "sec": "Metro-Metro", "km": 1757, "flt": 32, "avg": 6650, "t1": 12900, "t7": 7800, "t15": 6200, "t30": 5350, "t45": 4900, "chg": 2.1, "vol": "Moderate (11.4%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 5320, "tax": 665, "apt": 490, "aux": 175},
    {"id": "MAA-DEL", "orig": "MAA", "dest": "DEL", "sec": "Metro-Metro", "km": 1757, "flt": 32, "avg": 6610, "t1": 12800, "t7": 7750, "t15": 6170, "t30": 5310, "t45": 4870, "chg": 1.7, "vol": "Moderate (11.0%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 5280, "tax": 661, "apt": 490, "aux": 179},

    # High Density Tier-1 to Tier-2 & Leisure (18 Corridors)
    {"id": "DEL-PAT", "orig": "DEL", "dest": "PAT", "sec": "High Density Tier-2", "km": 853, "flt": 24, "avg": 5120, "t1": 11800, "t7": 6400, "t15": 4800, "t30": 4100, "t45": 3700, "chg": 5.8, "vol": "High (19.8%)", "qual": "SOLD OUT", "stat": "Capacity Deficit", "base": 4090, "tax": 512, "apt": 355, "aux": 163},
    {"id": "PAT-DEL", "orig": "PAT", "dest": "DEL", "sec": "High Density Tier-2", "km": 853, "flt": 24, "avg": 5080, "t1": 11500, "t7": 6300, "t15": 4750, "t30": 4050, "t45": 3650, "chg": 4.5, "vol": "High (18.6%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 4060, "tax": 508, "apt": 355, "aux": 157},
    {"id": "BOM-GOI", "orig": "BOM", "dest": "GOI", "sec": "Leisure Corridor", "km": 435, "flt": 32, "avg": 3850, "t1": 8400, "t7": 4600, "t15": 3600, "t30": 3100, "t45": 2800, "chg": 7.1, "vol": "High (24.1%)", "qual": "HIGH OBSERVATION", "stat": "Surveillance Active", "base": 3080, "tax": 385, "apt": 260, "aux": 125},
    {"id": "GOI-BOM", "orig": "GOI", "dest": "BOM", "sec": "Leisure Corridor", "km": 435, "flt": 32, "avg": 3810, "t1": 8250, "t7": 4550, "t15": 3550, "t30": 3080, "t45": 2770, "chg": 6.4, "vol": "High (23.2%)", "qual": "HIGH OBSERVATION", "stat": "Surveillance Active", "base": 3050, "tax": 381, "apt": 260, "aux": 119},
    {"id": "DEL-AMD", "orig": "DEL", "dest": "AMD", "sec": "Metro-Tier2", "km": 768, "flt": 34, "avg": 4380, "t1": 8950, "t7": 5150, "t15": 4100, "t30": 3550, "t45": 3200, "chg": -1.2, "vol": "Low (7.1%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 3500, "tax": 438, "apt": 300, "aux": 142},
    {"id": "AMD-DEL", "orig": "AMD", "dest": "DEL", "sec": "Metro-Tier2", "km": 768, "flt": 34, "avg": 4350, "t1": 8850, "t7": 5100, "t15": 4080, "t30": 3520, "t45": 3180, "chg": -1.5, "vol": "Low (7.0%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 3480, "tax": 435, "apt": 300, "aux": 135},
    {"id": "BOM-AMD", "orig": "BOM", "dest": "AMD", "sec": "Metro-Tier2", "km": 441, "flt": 28, "avg": 3350, "t1": 6900, "t7": 3950, "t15": 3150, "t30": 2750, "t45": 2500, "chg": -2.1, "vol": "Low (6.2%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2680, "tax": 335, "apt": 225, "aux": 110},
    {"id": "AMD-BOM", "orig": "AMD", "dest": "BOM", "sec": "Metro-Tier2", "km": 441, "flt": 28, "avg": 3310, "t1": 6800, "t7": 3900, "t15": 3120, "t30": 2720, "t45": 2480, "chg": -2.4, "vol": "Low (6.0%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2650, "tax": 331, "apt": 225, "aux": 104},
    {"id": "DEL-LKO", "orig": "DEL", "dest": "LKO", "sec": "Metro-Tier2", "km": 419, "flt": 22, "avg": 3420, "t1": 7100, "t7": 4100, "t15": 3250, "t30": 2850, "t45": 2600, "chg": -1.8, "vol": "Low (6.5%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2730, "tax": 342, "apt": 230, "aux": 118},
    {"id": "LKO-DEL", "orig": "LKO", "dest": "DEL", "sec": "Metro-Tier2", "km": 419, "flt": 22, "avg": 3390, "t1": 7000, "t7": 4050, "t15": 3220, "t30": 2820, "t45": 2580, "chg": -1.9, "vol": "Low (6.3%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2710, "tax": 339, "apt": 230, "aux": 111},
    {"id": "DEL-PNQ", "orig": "DEL", "dest": "PNQ", "sec": "Metro-Tier2", "km": 1173, "flt": 26, "avg": 5350, "t1": 10600, "t7": 6300, "t15": 5000, "t30": 4300, "t45": 3850, "chg": 2.5, "vol": "Moderate (9.6%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 4280, "tax": 535, "apt": 375, "aux": 160},
    {"id": "PNQ-DEL", "orig": "PNQ", "dest": "DEL", "sec": "Metro-Tier2", "km": 1173, "flt": 26, "avg": 5310, "t1": 10500, "t7": 6250, "t15": 4970, "t30": 4270, "t45": 3820, "chg": 2.2, "vol": "Moderate (9.4%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 4250, "tax": 531, "apt": 375, "aux": 154},
    {"id": "BLR-PNQ", "orig": "BLR", "dest": "PNQ", "sec": "Tier1-Tier2", "km": 721, "flt": 20, "avg": 4100, "t1": 8200, "t7": 4850, "t15": 3850, "t30": 3350, "t45": 3050, "chg": 1.4, "vol": "Low (7.3%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 3280, "tax": 410, "apt": 280, "aux": 130},
    {"id": "PNQ-BLR", "orig": "PNQ", "dest": "BLR", "sec": "Tier1-Tier2", "km": 721, "flt": 20, "avg": 4070, "t1": 8100, "t7": 4800, "t15": 3820, "t30": 3320, "t45": 3020, "chg": 1.2, "vol": "Low (7.1%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 3250, "tax": 407, "apt": 280, "aux": 133},
    {"id": "DEL-IXC", "orig": "DEL", "dest": "IXC", "sec": "Short Haul", "km": 240, "flt": 16, "avg": 2890, "t1": 5900, "t7": 3450, "t15": 2750, "t30": 2400, "t45": 2200, "chg": -0.9, "vol": "Low (5.8%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2310, "tax": 289, "apt": 195, "aux": 96},
    {"id": "IXC-DEL", "orig": "IXC", "dest": "DEL", "sec": "Short Haul", "km": 240, "flt": 16, "avg": 2860, "t1": 5800, "t7": 3400, "t15": 2720, "t30": 2380, "t45": 2180, "chg": -1.1, "vol": "Low (5.6%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2290, "tax": 286, "apt": 195, "aux": 89},
    {"id": "DEL-JAI", "orig": "DEL", "dest": "JAI", "sec": "Short Haul", "km": 233, "flt": 14, "avg": 2750, "t1": 5600, "t7": 3300, "t15": 2600, "t30": 2300, "t45": 2100, "chg": -0.6, "vol": "Low (5.5%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2200, "tax": 275, "apt": 185, "aux": 90},
    {"id": "JAI-DEL", "orig": "JAI", "dest": "DEL", "sec": "Short Haul", "km": 233, "flt": 14, "avg": 2720, "t1": 5500, "t7": 3250, "t15": 2580, "t30": 2280, "t45": 2080, "chg": -0.7, "vol": "Low (5.4%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2180, "tax": 272, "apt": 185, "aux": 83},

    # Regional, North-East & South Connectors (16 Corridors)
    {"id": "DEL-GAU", "orig": "DEL", "dest": "GAU", "sec": "Regional Connector", "km": 1461, "flt": 18, "avg": 6350, "t1": 13900, "t7": 7800, "t15": 5900, "t30": 5050, "t45": 4500, "chg": 6.2, "vol": "High (21.4%)", "qual": "ANOMALY", "stat": "Surveillance Active", "base": 5080, "tax": 635, "apt": 460, "aux": 175},
    {"id": "GAU-DEL", "orig": "GAU", "dest": "DEL", "sec": "Regional Connector", "km": 1461, "flt": 18, "avg": 6290, "t1": 13600, "t7": 7700, "t15": 5850, "t30": 5010, "t45": 4460, "chg": 5.1, "vol": "High (20.5%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 5030, "tax": 629, "apt": 460, "aux": 171},
    {"id": "BLR-COK", "orig": "BLR", "dest": "COK", "sec": "Regional Connector", "km": 367, "flt": 22, "avg": 3250, "t1": 6900, "t7": 3900, "t15": 3100, "t30": 2650, "t45": 2400, "chg": 1.1, "vol": "Low (6.7%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2600, "tax": 325, "apt": 215, "aux": 110},
    {"id": "COK-BLR", "orig": "COK", "dest": "BLR", "sec": "Regional Connector", "km": 367, "flt": 22, "avg": 3210, "t1": 6800, "t7": 3850, "t15": 3070, "t30": 2620, "t45": 2380, "chg": 0.8, "vol": "Low (6.5%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2570, "tax": 321, "apt": 215, "aux": 104},
    {"id": "MAA-COK", "orig": "MAA", "dest": "COK", "sec": "Regional Connector", "km": 560, "flt": 18, "avg": 3680, "t1": 7600, "t7": 4350, "t15": 3480, "t30": 3000, "t45": 2720, "chg": 1.6, "vol": "Low (7.2%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2940, "tax": 368, "apt": 250, "aux": 122},
    {"id": "COK-MAA", "orig": "COK", "dest": "MAA", "sec": "Regional Connector", "km": 560, "flt": 18, "avg": 3640, "t1": 7500, "t7": 4300, "t15": 3450, "t30": 2970, "t45": 2690, "chg": 1.3, "vol": "Low (7.0%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2910, "tax": 364, "apt": 250, "aux": 116},
    {"id": "BOM-COK", "orig": "BOM", "dest": "COK", "sec": "Metro-Tier2", "km": 1068, "flt": 24, "avg": 4980, "t1": 10100, "t7": 5800, "t15": 4650, "t30": 4050, "t45": 3680, "chg": 2.9, "vol": "Moderate (10.8%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 3980, "tax": 498, "apt": 340, "aux": 162},
    {"id": "COK-BOM", "orig": "COK", "dest": "BOM", "sec": "Metro-Tier2", "km": 1068, "flt": 24, "avg": 4930, "t1": 9950, "t7": 5750, "t15": 4610, "t30": 4010, "t45": 3650, "chg": 2.6, "vol": "Moderate (10.5%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 3940, "tax": 493, "apt": 340, "aux": 157},
    {"id": "CCU-GAU", "orig": "CCU", "dest": "GAU", "sec": "Regional Connector", "km": 515, "flt": 16, "avg": 3550, "t1": 7300, "t7": 4200, "t15": 3350, "t30": 2900, "t45": 2650, "chg": -0.3, "vol": "Low (6.8%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2840, "tax": 355, "apt": 235, "aux": 120},
    {"id": "GAU-CCU", "orig": "GAU", "dest": "CCU", "sec": "Regional Connector", "km": 515, "flt": 16, "avg": 3510, "t1": 7200, "t7": 4150, "t15": 3320, "t30": 2870, "t45": 2620, "chg": -0.5, "vol": "Low (6.6%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2810, "tax": 351, "apt": 235, "aux": 114},
    {"id": "DEL-IXB", "orig": "DEL", "dest": "IXB", "sec": "Regional Connector", "km": 1113, "flt": 14, "avg": 5280, "t1": 10900, "t7": 6250, "t15": 4950, "t30": 4250, "t45": 3850, "chg": 3.9, "vol": "Moderate (13.5%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 4220, "tax": 528, "apt": 365, "aux": 167},
    {"id": "IXB-DEL", "orig": "IXB", "dest": "DEL", "sec": "Regional Connector", "km": 1113, "flt": 14, "avg": 5240, "t1": 10800, "t7": 6200, "t15": 4910, "t30": 4210, "t45": 3820, "chg": 3.6, "vol": "Moderate (13.1%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 4190, "tax": 524, "apt": 365, "aux": 161},
    {"id": "CCU-PAT", "orig": "CCU", "dest": "PAT", "sec": "Regional Connector", "km": 470, "flt": 12, "avg": 3410, "t1": 7150, "t7": 4100, "t15": 3220, "t30": 2800, "t45": 2550, "chg": 2.1, "vol": "Low (7.6%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2730, "tax": 341, "apt": 225, "aux": 114},
    {"id": "PAT-CCU", "orig": "PAT", "dest": "CCU", "sec": "Regional Connector", "km": 470, "flt": 12, "avg": 3380, "t1": 7050, "t7": 4050, "t15": 3190, "t30": 2770, "t45": 2520, "chg": 1.8, "vol": "Low (7.4%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2700, "tax": 338, "apt": 225, "aux": 117},
    {"id": "BLR-TRV", "orig": "BLR", "dest": "TRV", "sec": "Regional Connector", "km": 508, "flt": 14, "avg": 3590, "t1": 7350, "t7": 4250, "t15": 3380, "t30": 2930, "t45": 2680, "chg": 0.5, "vol": "Low (6.3%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2870, "tax": 359, "apt": 240, "aux": 121},
    {"id": "TRV-BLR", "orig": "TRV", "dest": "BLR", "sec": "Regional Connector", "km": 508, "flt": 14, "avg": 3560, "t1": 7250, "t7": 4200, "t15": 3350, "t30": 2900, "t45": 2650, "chg": 0.3, "vol": "Low (6.1%)", "qual": "STANDARD", "stat": "Normal Monitoring", "base": 2850, "tax": 356, "apt": 240, "aux": 114},
]


def _build_route_basket() -> List[RouteBasketItem]:
    """Convert raw corridor dicts to validated RouteBasketItem models."""
    routes = []
    for item in CORRIDORS_DATA:
        route = RouteBasketItem(
            route_id=item["id"],
            origin=item["orig"],
            destination=item["dest"],
            route_label=f"{item['orig']} → {item['dest']}",
            sector=item["sec"],
            distance_km=item["km"],
            daily_flights=item["flt"],
            avg_fare=item["avg"],
            t1_fare=item["t1"],
            t7_fare=item["t7"],
            t15_fare=item["t15"],
            t30_fare=item["t30"],
            t45_fare=item["t45"],
            change_pct=item["chg"],
            volatility=item["vol"],
            quality=item["qual"],
            status=item["stat"],
            base_fare=item["base"],
            taxes=item["tax"],
            airport_charges=item["apt"],
            aux_fees=item["aux"],
            weight_status="DEMO",
        )
        routes.append(route)
    return routes


class DashboardService:
    """Service providing deterministic demonstration data for Milestone 1."""

    def __init__(self):
        self._routes = _build_route_basket()
        # Validate consistency on initialization
        assert len(self._routes) == 50, f"Expected 50 corridors, found {len(self._routes)}"
        ids = [r.route_id for r in self._routes]
        assert len(set(ids)) == 50, "Route IDs in corridor basket must be unique"
        for r in self._routes:
            assert r.origin != r.destination, f"Origin equals destination in route {r.route_id}"

    def get_summary(self) -> DashboardSummaryResponse:
        """Return executive KPI summary metrics."""
        return DashboardSummaryResponse(
            source_type="DEMO",
            data_status="DEMONSTRATION",
            demo_data=True,
            last_updated=FIXED_SNAPSHOT_TIME,
            headline_index=124.5,
            core_index=119.8,
            daily_change=1.2,
            weekly_change=3.4,
            route_count=50,
            observation_count=1200000,
            data_quality=99.4,
            sparkline_headline=[121.2, 121.8, 122.5, 123.1, 123.7, 124.1, 124.5],
            sparkline_core=[118.5, 118.7, 119.0, 119.2, 119.4, 119.6, 119.8],
        )

    def get_timeseries(
        self,
        frequency: str = "daily",
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> DashboardTimeseriesResponse:
        """Return historical index time series for Headline and Core."""
        freq = frequency.lower() if frequency else "daily"
        if freq not in ["daily", "weekly", "monthly"]:
            freq = "daily"

        if freq == "weekly":
            points = [
                TimeseriesPoint(date="W28 (Jul 12)", headline=118.4, core=117.2, volume=280000),
                TimeseriesPoint(date="W29 (Jul 19)", headline=119.1, core=117.6, volume=289000),
                TimeseriesPoint(date="W30 (Jul 26)", headline=120.3, core=118.0, volume=295000),
                TimeseriesPoint(date="W31 (Aug 02)", headline=121.0, core=118.3, volume=301000),
                TimeseriesPoint(date="W32 (Aug 09)", headline=121.8, core=118.7, volume=298000),
                TimeseriesPoint(date="W33 (Aug 16)", headline=122.4, core=119.0, volume=310000),
                TimeseriesPoint(date="W34 (Aug 23)", headline=123.1, core=119.3, volume=315000),
                TimeseriesPoint(date="W35 (Aug 30)", headline=124.0, core=119.6, volume=322000),
                TimeseriesPoint(date="W36 (Sep 04)", headline=124.5, core=119.8, volume=328000),
            ]
        elif freq == "monthly":
            points = [
                TimeseriesPoint(date="Apr 2026", headline=116.5, core=115.8, volume=1150000),
                TimeseriesPoint(date="May 2026", headline=121.3, core=117.4, volume=1220000),
                TimeseriesPoint(date="Jun 2026", headline=119.6, core=117.9, volume=1180000),
                TimeseriesPoint(date="Jul 2026", headline=123.0, core=118.8, volume=1250000),
                TimeseriesPoint(date="Aug 2026", headline=124.5, core=119.8, volume=1280000),
            ]
        else:
            # Daily (default)
            points = [
                TimeseriesPoint(date="Aug 05", headline=120.1, core=118.2, volume=41200),
                TimeseriesPoint(date="Aug 09", headline=121.4, core=118.5, volume=42300),
                TimeseriesPoint(date="Aug 13", headline=122.0, core=118.7, volume=40900),
                TimeseriesPoint(date="Aug 17", headline=121.8, core=118.9, volume=43100),
                TimeseriesPoint(date="Aug 21", headline=123.2, core=119.1, volume=44200),
                TimeseriesPoint(date="Aug 25", headline=122.9, core=119.3, volume=43800),
                TimeseriesPoint(date="Aug 29", headline=123.7, core=119.5, volume=45100),
                TimeseriesPoint(date="Sep 01", headline=124.1, core=119.6, volume=46200),
                TimeseriesPoint(date="Sep 04", headline=124.5, core=119.8, volume=47150),
            ]

        return DashboardTimeseriesResponse(
            source_type="DEMO",
            data_status="DEMONSTRATION",
            demo_data=True,
            last_updated=FIXED_SNAPSHOT_TIME,
            frequency=freq,  # type: ignore[arg-type]
            base_period="Jan 2026 = 100",
            total_points=len(points),
            series=points,
        )

    def get_movers(self) -> DashboardMoversResponse:
        """
        Return exactly 5 top gainers and 5 top decliners from the 50-corridor basket.
        Derived directly from the same route basket to guarantee consistency.
        """
        sorted_by_change = sorted(self._routes, key=lambda r: r.change_pct, reverse=True)
        top_gainers_raw = sorted_by_change[:5]
        top_decliners_raw = sorted_by_change[-5:]  # Lowest / most negative

        gainers = [
            RouteMover(
                rank=i + 1,
                route_id=r.route_id,
                route_label=r.route_label,
                origin=r.origin,
                destination=r.destination,
                sector=r.sector,
                avg_fare=r.avg_fare,
                change_pct=r.change_pct,
                direction="up",
            )
            for i, r in enumerate(top_gainers_raw)
        ]

        decliners = [
            RouteMover(
                rank=i + 1,
                route_id=r.route_id,
                route_label=r.route_label,
                origin=r.origin,
                destination=r.destination,
                sector=r.sector,
                avg_fare=r.avg_fare,
                change_pct=r.change_pct,
                direction="down",
            )
            for i, r in enumerate(top_decliners_raw)
        ]

        return DashboardMoversResponse(
            source_type="DEMO",
            data_status="DEMONSTRATION",
            demo_data=True,
            last_updated=FIXED_SNAPSHOT_TIME,
            gainers=gainers,
            decliners=decliners,
        )

    def get_routes(self) -> DashboardRoutesResponse:
        """Return the complete 50-route demonstration basket."""
        return DashboardRoutesResponse(
            source_type="DEMO",
            data_status="DEMONSTRATION",
            demo_data=True,
            last_updated=FIXED_SNAPSHOT_TIME,
            total_routes=len(self._routes),
            routes=self._routes,
        )

    def get_horizons(self) -> DashboardHorizonsResponse:
        """
        Return the 5 required project horizons (T+1, T+7, T+15, T+30, T+45).
        No visual presentation attributes (e.g. colors) are returned by the backend.
        """
        horizons = [
            HorizonItem(
                horizon="T+1",
                lead_days=1,
                index_value=142.8,
                average_fare=10450,
                change_pct=5.8,
                description="24–48h Last-minute emergency & spot volatility window",
            ),
            HorizonItem(
                horizon="T+7",
                lead_days=7,
                index_value=128.4,
                average_fare=6350,
                change_pct=2.1,
                description="7-Day advance urgent & short-term business window",
            ),
            HorizonItem(
                horizon="T+15",
                lead_days=15,
                index_value=124.5,
                average_fare=5100,
                change_pct=1.2,
                description="15-Day domestic corporate baseline horizon",
            ),
            HorizonItem(
                horizon="T+30",
                lead_days=30,
                index_value=114.2,
                average_fare=4350,
                change_pct=0.4,
                description="30-Day standard leisure planning window",
            ),
            HorizonItem(
                horizon="T+45",
                lead_days=45,
                index_value=108.6,
                average_fare=3890,
                change_pct=-0.2,
                description="45-Day extended advance lowest fare floor",
            ),
        ]
        return DashboardHorizonsResponse(
            source_type="DEMO",
            data_status="DEMONSTRATION",
            demo_data=True,
            last_updated=FIXED_SNAPSHOT_TIME,
            definition="Required project horizons for domestic airfare monitoring",
            horizons=horizons,
        )

    def get_carriers(self) -> DashboardCarriersResponse:
        """
        Return demonstration carrier set.
        Explicitly marked as DEMO_REFERENCE and excludes presentation colors.
        """
        carriers = [
            CarrierComparisonItem(
                code="6E",
                name="IndiGo",
                market_share=62.4,
                market_share_type="DEMO_REFERENCE",
                avg_fare=5420,
                daily_flights=1950,
                carrier_type="Low-Cost Carrier (LCC)",
            ),
            CarrierComparisonItem(
                code="AI",
                name="Air India",
                market_share=14.8,
                market_share_type="DEMO_REFERENCE",
                avg_fare=6180,
                daily_flights=540,
                carrier_type="Full-Service Carrier (FSC)",
            ),
            CarrierComparisonItem(
                code="SG",
                name="SpiceJet",
                market_share=4.2,
                market_share_type="DEMO_REFERENCE",
                avg_fare=4890,
                daily_flights=180,
                carrier_type="Low-Cost Carrier (LCC)",
            ),
            CarrierComparisonItem(
                code="QP",
                name="Akasa Air",
                market_share=5.1,
                market_share_type="DEMO_REFERENCE",
                avg_fare=5120,
                daily_flights=160,
                carrier_type="Low-Cost Carrier (LCC)",
            ),
            CarrierComparisonItem(
                code="IX",
                name="AIX Connect / Air India Express",
                market_share=13.5,
                market_share_type="DEMO_REFERENCE",
                avg_fare=5290,
                daily_flights=420,
                carrier_type="Low-Cost Carrier (LCC)",
            ),
        ]
        return DashboardCarriersResponse(
            source_type="DEMO",
            data_status="DEMONSTRATION",
            demo_data=True,
            last_updated=FIXED_SNAPSHOT_TIME,
            carrier_universe="Demonstration carrier set",
            carriers=carriers,
        )

    def get_alerts(self) -> DashboardAlertsResponse:
        """
        Return demonstration surveillance alerts.
        Not generated by an ML anomaly engine.
        """
        alerts = [
            SurveillanceAlertItem(
                id="DEMO-ALT-001",
                category="PRICE MOVEMENT",
                title="Spot Surge in Western Corridors",
                detail="T+1 fares for Mumbai sectors registered a +5.4% jump driven by business travel demand and 89% seat factor.",
                timestamp="22 mins ago",
                level="warning",
                corridor_id="DEL-BOM",
                horizon="T+1",
                demo_alert=True,
            ),
            SurveillanceAlertItem(
                id="DEMO-ALT-002",
                category="MARKET STRUCTURE",
                title="Capacity Shift on DEL-PAT",
                detail="High-frequency spot sell-outs detected on Delhi-Patna corridor. Fares trading 2.3x above baseline.",
                timestamp="1 hour ago",
                level="anomaly",
                corridor_id="DEL-PAT",
                horizon="T+1",
                demo_alert=True,
            ),
            SurveillanceAlertItem(
                id="DEMO-ALT-003",
                category="DATA QUALITY",
                title="High Observation Confidence",
                detail="1.2M demo observations simulated across 5 carriers for UI validation.",
                timestamp="3 hours ago",
                level="healthy",
                demo_alert=True,
            ),
            SurveillanceAlertItem(
                id="DEMO-ALT-004",
                category="SPIKE DETECTION",
                title="Eastern Corridor Stability",
                detail="Kolkata and Guwahati corridors show stable price relatives within ±0.6% deviation.",
                timestamp="5 hours ago",
                level="info",
                corridor_id="CCU-DEL",
                horizon="T+15",
                demo_alert=True,
            ),
        ]
        return DashboardAlertsResponse(
            source_type="DEMO",
            data_status="DEMONSTRATION",
            demo_data=True,
            last_updated=FIXED_SNAPSHOT_TIME,
            alert_type="Demonstration surveillance alerts",
            alerts=alerts,
        )


# Singleton instance for endpoint handlers
dashboard_service = DashboardService()
