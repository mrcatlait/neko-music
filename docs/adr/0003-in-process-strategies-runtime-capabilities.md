# Import strategies are in-process and capabilities are backend-driven

Import methods are implemented as in-process registered strategies with stable strategy keys, and the web client discovers capabilities from backend runtime contracts rather than hardcoded sources. We chose this to keep plugin behavior safe and operationally simple in v1 while allowing strategy growth without frontend drift.
