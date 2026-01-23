// data.js
// mathjs-compatible expressions (use ^ for powers; functions: sqrt, sin, cos, tan, log, abs, max, factorial; constants: pi, e)
const formulas = [
    // ============================================================
    // Physics (Mechanics)
    // ============================================================
    {
        id: "average_speed",
        category: "Physics (Mechanics)",
        title: "Average Speed",
        description: "Average speed v = d/t",
        inputs: [
            { label: "Distance (d)", key: "d", type: "number", unit: "m", required: true },
            { label: "Time (t)", key: "t", type: "number", unit: "s", required: true }
        ],
        expression: "d / t",
        output: { label: "Speed (v)", unit: "m/s" },
        examples: [{ d: 120, t: 10 }]
    },
    {
        id: "average_velocity",
        category: "Physics (Mechanics)",
        title: "Average Velocity",
        description: "Average velocity v = Δx/Δt",
        inputs: [
            { label: "Displacement (dx)", key: "dx", type: "number", unit: "m", required: true },
            { label: "Time (dt)", key: "dt", type: "number", unit: "s", required: true }
        ],
        expression: "dx / dt",
        output: { label: "Velocity (v)", unit: "m/s" },
        examples: [{ dx: 50, dt: 5 }]
    },
    {
        id: "acceleration_from_velocities",
        category: "Physics (Mechanics)",
        title: "Acceleration",
        description: "a = (v - u)/t",
        inputs: [
            { label: "Final velocity (v)", key: "v", type: "number", unit: "m/s", required: true },
            { label: "Initial velocity (u)", key: "u", type: "number", unit: "m/s", required: true },
            { label: "Time (t)", key: "t", type: "number", unit: "s", required: true }
        ],
        expression: "(v - u) / t",
        output: { label: "Acceleration (a)", unit: "m/s^2" },
        examples: [{ u: 0, v: 20, t: 4 }]
    },
    {
        id: "kinematics_v_uat",
        category: "Physics (Mechanics)",
        title: "Kinematics: v = u + at",
        description: "Final velocity under constant acceleration",
        inputs: [
            { label: "Initial velocity (u)", key: "u", type: "number", unit: "m/s", required: true },
            { label: "Acceleration (a)", key: "a", type: "number", unit: "m/s^2", required: true },
            { label: "Time (t)", key: "t", type: "number", unit: "s", required: true }
        ],
        expression: "u + a * t",
        output: { label: "Final velocity (v)", unit: "m/s" },
        examples: [{ u: 5, a: 2, t: 6 }]
    },
    {
        id: "kinematics_s_ut_halfat2",
        category: "Physics (Mechanics)",
        title: "Kinematics: s = ut + 1/2 at^2",
        description: "Displacement under constant acceleration",
        inputs: [
            { label: "Initial velocity (u)", key: "u", type: "number", unit: "m/s", required: true },
            { label: "Acceleration (a)", key: "a", type: "number", unit: "m/s^2", required: true },
            { label: "Time (t)", key: "t", type: "number", unit: "s", required: true }
        ],
        expression: "u * t + 0.5 * a * t^2",
        output: { label: "Displacement (s)", unit: "m" },
        examples: [{ u: 0, a: 9.81, t: 2 }]
    },
    {
        id: "kinematics_v2_u2_2as",
        category: "Physics (Mechanics)",
        title: "Kinematics: v^2 = u^2 + 2as",
        description: "Velocity-displacement relation",
        inputs: [
            { label: "Initial velocity (u)", key: "u", type: "number", unit: "m/s", required: true },
            { label: "Acceleration (a)", key: "a", type: "number", unit: "m/s^2", required: true },
            { label: "Displacement (s)", key: "s", type: "number", unit: "m", required: true }
        ],
        expression: "u^2 + 2 * a * s",
        output: { label: "v^2", unit: "(m/s)^2" },
        examples: [{ u: 4, a: 3, s: 10 }]
    },
    {
        id: "newton_second_law_force",
        category: "Physics (Mechanics)",
        title: "Newton's 2nd Law",
        description: "Force F = ma",
        inputs: [
            { label: "Mass (m)", key: "m", type: "number", unit: "kg", required: true },
            { label: "Acceleration (a)", key: "a", type: "number", unit: "m/s^2", required: true }
        ],
        expression: "m * a",
        output: { label: "Force (F)", unit: "N" },
        examples: [{ m: 3, a: 2 }]
    },
    {
        id: "weight_force",
        category: "Physics (Mechanics)",
        title: "Weight",
        description: "Weight W = mg",
        inputs: [
            { label: "Mass (m)", key: "m", type: "number", unit: "kg", required: true },
            { label: "Gravity (g)", key: "g", type: "number", unit: "m/s^2", required: true }
        ],
        expression: "m * g",
        output: { label: "Weight (W)", unit: "N" },
        examples: [{ m: 70, g: 9.81 }]
    },
    {
        id: "momentum",
        category: "Physics (Mechanics)",
        title: "Momentum",
        description: "Linear momentum p = mv",
        inputs: [
            { label: "Mass (m)", key: "m", type: "number", unit: "kg", required: true },
            { label: "Velocity (v)", key: "v", type: "number", unit: "m/s", required: true }
        ],
        expression: "m * v",
        output: { label: "Momentum (p)", unit: "kg·m/s" },
        examples: [{ m: 5, v: 4 }]
    },
    {
        id: "impulse_constant_force",
        category: "Physics (Mechanics)",
        title: "Impulse (constant F)",
        description: "Impulse J = Ft",
        inputs: [
            { label: "Force (F)", key: "F", type: "number", unit: "N", required: true },
            { label: "Time (t)", key: "t", type: "number", unit: "s", required: true }
        ],
        expression: "F * t",
        output: { label: "Impulse (J)", unit: "N·s" },
        examples: [{ F: 50, t: 0.2 }]
    },
    {
        id: "kinetic_energy",
        category: "Physics (Mechanics)",
        title: "Kinetic Energy",
        description: "Kinetic energy K = 1/2 mv^2",
        inputs: [
            { label: "Mass (m)", key: "m", type: "number", unit: "kg", required: true },
            { label: "Velocity (v)", key: "v", type: "number", unit: "m/s", required: true }
        ],
        expression: "0.5 * m * v^2",
        output: { label: "Energy (K)", unit: "J" },
        examples: [{ m: 2, v: 3 }]
    },
    {
        id: "gravitational_potential_energy",
        category: "Physics (Mechanics)",
        title: "Gravitational Potential Energy",
        description: "Potential energy U = mgh",
        inputs: [
            { label: "Mass (m)", key: "m", type: "number", unit: "kg", required: true },
            { label: "Gravity (g)", key: "g", type: "number", unit: "m/s^2", required: true },
            { label: "Height (h)", key: "h", type: "number", unit: "m", required: true }
        ],
        expression: "m * g * h",
        output: { label: "Energy (U)", unit: "J" },
        examples: [{ m: 2, g: 9.81, h: 3 }]
    },
    {
        id: "work_done_angle",
        category: "Physics (Mechanics)",
        title: "Work Done",
        description: "Work W = F d cos(theta), theta in radians",
        inputs: [
            { label: "Force (F)", key: "F", type: "number", unit: "N", required: true },
            { label: "Displacement (d)", key: "d", type: "number", unit: "m", required: true },
            { label: "Angle (theta)", key: "theta", type: "number", unit: "rad", required: true }
        ],
        expression: "F * d * cos(theta)",
        output: { label: "Work (W)", unit: "J" },
        examples: [{ F: 10, d: 5, theta: 0 }]
    },
    {
        id: "power_average",
        category: "Physics (Mechanics)",
        title: "Average Power",
        description: "Power P = W/t",
        inputs: [
            { label: "Work (W)", key: "W", type: "number", unit: "J", required: true },
            { label: "Time (t)", key: "t", type: "number", unit: "s", required: true }
        ],
        expression: "W / t",
        output: { label: "Power (P)", unit: "W" },
        examples: [{ W: 600, t: 12 }]
    },
    {
        id: "pressure",
        category: "Physics (Mechanics)",
        title: "Pressure",
        description: "Pressure p = F/A",
        inputs: [
            { label: "Force (F)", key: "F", type: "number", unit: "N", required: true },
            { label: "Area (A)", key: "A", type: "number", unit: "m^2", required: true }
        ],
        expression: "F / A",
        output: { label: "Pressure (p)", unit: "Pa" },
        examples: [{ F: 100, A: 0.5 }]
    },
    {
        id: "density",
        category: "Physics (Mechanics)",
        title: "Density",
        description: "Density rho = m/V",
        inputs: [
            { label: "Mass (m)", key: "m", type: "number", unit: "kg", required: true },
            { label: "Volume (V)", key: "V", type: "number", unit: "m^3", required: true }
        ],
        expression: "m / V",
        output: { label: "Density (rho)", unit: "kg/m^3" },
        examples: [{ m: 2.7, V: 0.001 }]
    },
    {
        id: "hydrostatic_pressure",
        category: "Physics (Mechanics)",
        title: "Hydrostatic Pressure",
        description: "Pressure at depth p = rho g h",
        inputs: [
            { label: "Density (rho)", key: "rho", type: "number", unit: "kg/m^3", required: true },
            { label: "Gravity (g)", key: "g", type: "number", unit: "m/s^2", required: true },
            { label: "Depth (h)", key: "h", type: "number", unit: "m", required: true }
        ],
        expression: "rho * g * h",
        output: { label: "Pressure (p)", unit: "Pa" },
        examples: [{ rho: 1000, g: 9.81, h: 5 }]
    },
    {
        id: "buoyant_force",
        category: "Physics (Mechanics)",
        title: "Buoyant Force",
        description: "Buoyant force Fb = rho g V",
        inputs: [
            { label: "Fluid density (rho)", key: "rho", type: "number", unit: "kg/m^3", required: true },
            { label: "Gravity (g)", key: "g", type: "number", unit: "m/s^2", required: true },
            { label: "Displaced volume (V)", key: "V", type: "number", unit: "m^3", required: true }
        ],
        expression: "rho * g * V",
        output: { label: "Buoyant force (Fb)", unit: "N" },
        examples: [{ rho: 1000, g: 9.81, V: 0.02 }]
    },
    {
        id: "hookes_law_force",
        category: "Physics (Mechanics)",
        title: "Hooke's Law",
        description: "Spring force magnitude F = kx",
        inputs: [
            { label: "Spring constant (k)", key: "k", type: "number", unit: "N/m", required: true },
            { label: "Extension (x)", key: "x", type: "number", unit: "m", required: true }
        ],
        expression: "k * x",
        output: { label: "Force (F)", unit: "N" },
        examples: [{ k: 200, x: 0.05 }]
    },
    {
        id: "spring_potential_energy",
        category: "Physics (Mechanics)",
        title: "Spring Potential Energy",
        description: "Elastic energy U = 1/2 kx^2",
        inputs: [
            { label: "Spring constant (k)", key: "k", type: "number", unit: "N/m", required: true },
            { label: "Extension (x)", key: "x", type: "number", unit: "m", required: true }
        ],
        expression: "0.5 * k * x^2",
        output: { label: "Energy (U)", unit: "J" },
        examples: [{ k: 100, x: 0.2 }]
    },
    {
        id: "centripetal_acceleration",
        category: "Physics (Mechanics)",
        title: "Centripetal Acceleration",
        description: "ac = v^2/r",
        inputs: [
            { label: "Speed (v)", key: "v", type: "number", unit: "m/s", required: true },
            { label: "Radius (r)", key: "r", type: "number", unit: "m", required: true }
        ],
        expression: "v^2 / r",
        output: { label: "Acceleration (ac)", unit: "m/s^2" },
        examples: [{ v: 12, r: 3 }]
    },
    {
        id: "centripetal_force",
        category: "Physics (Mechanics)",
        title: "Centripetal Force",
        description: "Fc = mv^2/r",
        inputs: [
            { label: "Mass (m)", key: "m", type: "number", unit: "kg", required: true },
            { label: "Speed (v)", key: "v", type: "number", unit: "m/s", required: true },
            { label: "Radius (r)", key: "r", type: "number", unit: "m", required: true }
        ],
        expression: "m * v^2 / r",
        output: { label: "Force (Fc)", unit: "N" },
        examples: [{ m: 1.5, v: 10, r: 2 }]
    },
    {
        id: "angular_velocity_from_period",
        category: "Physics (Mechanics)",
        title: "Angular Velocity",
        description: "omega = 2pi/T",
        inputs: [{ label: "Period (T)", key: "T", type: "number", unit: "s", required: true }],
        expression: "2 * pi / T",
        output: { label: "Angular velocity (omega)", unit: "rad/s" },
        examples: [{ T: 0.5 }]
    },
    {
        id: "linear_speed_from_angular",
        category: "Physics (Mechanics)",
        title: "Linear Speed (circular motion)",
        description: "v = omega r",
        inputs: [
            { label: "Angular speed (omega)", key: "omega", type: "number", unit: "rad/s", required: true },
            { label: "Radius (r)", key: "r", type: "number", unit: "m", required: true }
        ],
        expression: "omega * r",
        output: { label: "Speed (v)", unit: "m/s" },
        examples: [{ omega: 10, r: 0.2 }]
    },
    {
        id: "universal_gravitation_force",
        category: "Physics (Mechanics)",
        title: "Universal Gravitation",
        description: "F = G m1 m2 / r^2",
        inputs: [
            { label: "Gravitational constant (G)", key: "G", type: "number", unit: "N·m^2/kg^2", required: true },
            { label: "Mass 1 (m1)", key: "m1", type: "number", unit: "kg", required: true },
            { label: "Mass 2 (m2)", key: "m2", type: "number", unit: "kg", required: true },
            { label: "Distance (r)", key: "r", type: "number", unit: "m", required: true }
        ],
        expression: "G * m1 * m2 / r^2",
        output: { label: "Force (F)", unit: "N" },
        examples: [{ G: 6.674e-11, m1: 5.97e24, m2: 1000, r: 6.37e6 }]
    },
    {
        id: "escape_velocity",
        category: "Physics (Mechanics)",
        title: "Escape Velocity",
        description: "ve = sqrt(2GM/R)",
        inputs: [
            { label: "Gravitational constant (G)", key: "G", type: "number", unit: "N·m^2/kg^2", required: true },
            { label: "Mass (M)", key: "M", type: "number", unit: "kg", required: true },
            { label: "Radius (R)", key: "R", type: "number", unit: "m", required: true }
        ],
        expression: "sqrt(2 * G * M / R)",
        output: { label: "Escape velocity (ve)", unit: "m/s" },
        examples: [{ G: 6.674e-11, M: 5.97e24, R: 6.37e6 }]
    },

    // ============================================================
    // Physics (Waves)
    // ============================================================
    {
        id: "wave_speed",
        category: "Physics (Waves)",
        title: "Wave Speed",
        description: "v = f * lambda",
        inputs: [
            { label: "Frequency (f)", key: "f", type: "number", unit: "Hz", required: true },
            { label: "Wavelength (lambda)", key: "lambda", type: "number", unit: "m", required: true }
        ],
        expression: "f * lambda",
        output: { label: "Wave speed (v)", unit: "m/s" },
        examples: [{ f: 50, lambda: 0.68 }]
    },
    {
        id: "frequency_from_period",
        category: "Physics (Waves)",
        title: "Frequency from Period",
        description: "f = 1/T",
        inputs: [{ label: "Period (T)", key: "T", type: "number", unit: "s", required: true }],
        expression: "1 / T",
        output: { label: "Frequency (f)", unit: "Hz" },
        examples: [{ T: 0.02 }]
    },
    {
        id: "period_from_frequency",
        category: "Physics (Waves)",
        title: "Period from Frequency",
        description: "T = 1/f",
        inputs: [{ label: "Frequency (f)", key: "f", type: "number", unit: "Hz", required: true }],
        expression: "1 / f",
        output: { label: "Period (T)", unit: "s" },
        examples: [{ f: 5 }]
    },
    {
        id: "angular_frequency",
        category: "Physics (Waves)",
        title: "Angular Frequency",
        description: "omega = 2pi f",
        inputs: [{ label: "Frequency (f)", key: "f", type: "number", unit: "Hz", required: true }],
        expression: "2 * pi * f",
        output: { label: "Angular frequency (omega)", unit: "rad/s" },
        examples: [{ f: 10 }]
    },
    {
        id: "simple_harmonic_displacement",
        category: "Physics (Waves)",
        title: "SHM Displacement",
        description: "x(t) = A sin(omega t + phi), angles in radians",
        inputs: [
            { label: "Amplitude (A)", key: "A", type: "number", unit: "m", required: true },
            { label: "Angular frequency (omega)", key: "omega", type: "number", unit: "rad/s", required: true },
            { label: "Time (t)", key: "t", type: "number", unit: "s", required: true },
            { label: "Phase (phi)", key: "phi", type: "number", unit: "rad", required: true }
        ],
        expression: "A * sin(omega * t + phi)",
        output: { label: "Displacement (x)", unit: "m" },
        examples: [{ A: 0.1, omega: 6.28318530718, t: 0.25, phi: 0 }]
    },
    {
        id: "sound_intensity_level_db",
        category: "Physics (Waves)",
        title: "Sound Level (dB)",
        description: "beta = 10 log10(I/I0) using natural logs",
        inputs: [
            { label: "Intensity (I)", key: "I", type: "number", unit: "W/m^2", required: true },
            { label: "Reference intensity (I0)", key: "I0", type: "number", unit: "W/m^2", required: true }
        ],
        expression: "10 * (log(I / I0) / log(10))",
        output: { label: "Sound level (beta)", unit: "dB" },
        examples: [{ I: 1e-6, I0: 1e-12 }]
    },
    {
        id: "doppler_effect_moving_source_observer",
        category: "Physics (Waves)",
        title: "Doppler Effect",
        description: "f' = f * (v + vo)/(v - vs) (signs depend on direction)",
        inputs: [
            { label: "Observed frequency base (f)", key: "f", type: "number", unit: "Hz", required: true },
            { label: "Wave speed (v)", key: "v", type: "number", unit: "m/s", required: true },
            { label: "Observer speed (vo)", key: "vo", type: "number", unit: "m/s", required: true },
            { label: "Source speed (vs)", key: "vs", type: "number", unit: "m/s", required: true }
        ],
        expression: "f * (v + vo) / (v - vs)",
        output: { label: "Observed frequency (f_prime)", unit: "Hz" },
        examples: [{ f: 500, v: 340, vo: 10, vs: 0 }]
    },

    // ============================================================
    // Physics (Electricity & Magnetism)
    // ============================================================
    {
        id: "charge_from_current",
        category: "Physics (Electricity & Magnetism)",
        title: "Charge",
        description: "Q = I t",
        inputs: [
            { label: "Current (I)", key: "I", type: "number", unit: "A", required: true },
            { label: "Time (t)", key: "t", type: "number", unit: "s", required: true }
        ],
        expression: "I * t",
        output: { label: "Charge (Q)", unit: "C" },
        examples: [{ I: 2, t: 30 }]
    },
    {
        id: "ohms_law_voltage",
        category: "Physics (Electricity & Magnetism)",
        title: "Ohm's Law",
        description: "V = I R",
        inputs: [
            { label: "Current (I)", key: "I", type: "number", unit: "A", required: true },
            { label: "Resistance (R)", key: "R", type: "number", unit: "ohm", required: true }
        ],
        expression: "I * R",
        output: { label: "Voltage (V)", unit: "V" },
        examples: [{ I: 0.5, R: 10 }]
    },
    {
        id: "ohms_law_current",
        category: "Physics (Electricity & Magnetism)",
        title: "Ohm's Law (solve I)",
        description: "I = V/R",
        inputs: [
            { label: "Voltage (V)", key: "V", type: "number", unit: "V", required: true },
            { label: "Resistance (R)", key: "R", type: "number", unit: "ohm", required: true }
        ],
        expression: "V / R",
        output: { label: "Current (I)", unit: "A" },
        examples: [{ V: 12, R: 6 }]
    },
    {
        id: "electrical_power_vi",
        category: "Physics (Electricity & Magnetism)",
        title: "Electrical Power",
        description: "P = V I",
        inputs: [
            { label: "Voltage (V)", key: "V", type: "number", unit: "V", required: true },
            { label: "Current (I)", key: "I", type: "number", unit: "A", required: true }
        ],
        expression: "V * I",
        output: { label: "Power (P)", unit: "W" },
        examples: [{ V: 12, I: 2 }]
    },
    {
        id: "electrical_power_i2r",
        category: "Physics (Electricity & Magnetism)",
        title: "Electrical Power (Joule)",
        description: "P = I^2 R",
        inputs: [
            { label: "Current (I)", key: "I", type: "number", unit: "A", required: true },
            { label: "Resistance (R)", key: "R", type: "number", unit: "ohm", required: true }
        ],
        expression: "I^2 * R",
        output: { label: "Power (P)", unit: "W" },
        examples: [{ I: 3, R: 4 }]
    },
    {
        id: "electrical_power_v2r",
        category: "Physics (Electricity & Magnetism)",
        title: "Electrical Power (V^2/R)",
        description: "P = V^2 / R",
        inputs: [
            { label: "Voltage (V)", key: "V", type: "number", unit: "V", required: true },
            { label: "Resistance (R)", key: "R", type: "number", unit: "ohm", required: true }
        ],
        expression: "V^2 / R",
        output: { label: "Power (P)", unit: "W" },
        examples: [{ V: 24, R: 12 }]
    },
    {
        id: "electrical_energy",
        category: "Physics (Electricity & Magnetism)",
        title: "Electrical Energy",
        description: "E = P t",
        inputs: [
            { label: "Power (P)", key: "P", type: "number", unit: "W", required: true },
            { label: "Time (t)", key: "t", type: "number", unit: "s", required: true }
        ],
        expression: "P * t",
        output: { label: "Energy (E)", unit: "J" },
        examples: [{ P: 60, t: 120 }]
    },
    {
        id: "resistance_from_resistivity",
        category: "Physics (Electricity & Magnetism)",
        title: "Resistance (from resistivity)",
        description: "R = rho L / A",
        inputs: [
            { label: "Resistivity (rho)", key: "rho", type: "number", unit: "ohm·m", required: true },
            { label: "Length (L)", key: "L", type: "number", unit: "m", required: true },
            { label: "Area (A)", key: "A", type: "number", unit: "m^2", required: true }
        ],
        expression: "rho * L / A",
        output: { label: "Resistance (R)", unit: "ohm" },
        examples: [{ rho: 1.68e-8, L: 2, A: 1e-6 }]
    },
    {
        id: "resistors_series_3",
        category: "Physics (Electricity & Magnetism)",
        title: "Resistors in Series (3)",
        description: "Req = R1 + R2 + R3",
        inputs: [
            { label: "R1", key: "R1", type: "number", unit: "ohm", required: true },
            { label: "R2", key: "R2", type: "number", unit: "ohm", required: true },
            { label: "R3", key: "R3", type: "number", unit: "ohm", required: true }
        ],
        expression: "R1 + R2 + R3",
        output: { label: "Equivalent resistance (Req)", unit: "ohm" },
        examples: [{ R1: 10, R2: 20, R3: 30 }]
    },
    {
        id: "resistors_parallel_2",
        category: "Physics (Electricity & Magnetism)",
        title: "Resistors in Parallel (2)",
        description: "Req = 1 / (1/R1 + 1/R2)",
        inputs: [
            { label: "R1", key: "R1", type: "number", unit: "ohm", required: true },
            { label: "R2", key: "R2", type: "number", unit: "ohm", required: true }
        ],
        expression: "1 / (1/R1 + 1/R2)",
        output: { label: "Equivalent resistance (Req)", unit: "ohm" },
        examples: [{ R1: 6, R2: 3 }]
    },
    {
        id: "coulombs_law",
        category: "Physics (Electricity & Magnetism)",
        title: "Coulomb's Law",
        description: "F = k q1 q2 / r^2",
        inputs: [
            { label: "Coulomb constant (k)", key: "k", type: "number", unit: "N·m^2/C^2", required: true },
            { label: "Charge q1", key: "q1", type: "number", unit: "C", required: true },
            { label: "Charge q2", key: "q2", type: "number", unit: "C", required: true },
            { label: "Distance (r)", key: "r", type: "number", unit: "m", required: true }
        ],
        expression: "k * q1 * q2 / r^2",
        output: { label: "Force (F)", unit: "N" },
        examples: [{ k: 8.988e9, q1: 1e-6, q2: 2e-6, r: 0.1 }]
    },
    {
        id: "electric_field_point_charge",
        category: "Physics (Electricity & Magnetism)",
        title: "Electric Field (point charge)",
        description: "E = k q / r^2",
        inputs: [
            { label: "Coulomb constant (k)", key: "k", type: "number", unit: "N·m^2/C^2", required: true },
            { label: "Charge (q)", key: "q", type: "number", unit: "C", required: true },
            { label: "Distance (r)", key: "r", type: "number", unit: "m", required: true }
        ],
        expression: "k * q / r^2",
        output: { label: "Electric field (E)", unit: "N/C" },
        examples: [{ k: 8.988e9, q: 1e-6, r: 0.2 }]
    },
    {
        id: "electric_potential_point_charge",
        category: "Physics (Electricity & Magnetism)",
        title: "Electric Potential (point charge)",
        description: "V = k q / r",
        inputs: [
            { label: "Coulomb constant (k)", key: "k", type: "number", unit: "N·m^2/C^2", required: true },
            { label: "Charge (q)", key: "q", type: "number", unit: "C", required: true },
            { label: "Distance (r)", key: "r", type: "number", unit: "m", required: true }
        ],
        expression: "k * q / r",
        output: { label: "Potential (V)", unit: "V" },
        examples: [{ k: 8.988e9, q: 2e-6, r: 0.5 }]
    },
    {
        id: "capacitance",
        category: "Physics (Electricity & Magnetism)",
        title: "Capacitance",
        description: "C = Q/V",
        inputs: [
            { label: "Charge (Q)", key: "Q", type: "number", unit: "C", required: true },
            { label: "Voltage (V)", key: "V", type: "number", unit: "V", required: true }
        ],
        expression: "Q / V",
        output: { label: "Capacitance (C)", unit: "F" },
        examples: [{ Q: 0.002, V: 10 }]
    },
    {
        id: "energy_in_capacitor",
        category: "Physics (Electricity & Magnetism)",
        title: "Energy in Capacitor",
        description: "U = 1/2 C V^2",
        inputs: [
            { label: "Capacitance (C)", key: "C", type: "number", unit: "F", required: true },
            { label: "Voltage (V)", key: "V", type: "number", unit: "V", required: true }
        ],
        expression: "0.5 * C * V^2",
        output: { label: "Energy (U)", unit: "J" },
        examples: [{ C: 0.001, V: 12 }]
    },
    {
        id: "capacitors_series_2",
        category: "Physics (Electricity & Magnetism)",
        title: "Capacitors in Series (2)",
        description: "Ceq = 1/(1/C1 + 1/C2)",
        inputs: [
            { label: "C1", key: "C1", type: "number", unit: "F", required: true },
            { label: "C2", key: "C2", type: "number", unit: "F", required: true }
        ],
        expression: "1 / (1/C1 + 1/C2)",
        output: { label: "Equivalent capacitance (Ceq)", unit: "F" },
        examples: [{ C1: 2e-6, C2: 3e-6 }]
    },
    {
        id: "capacitors_parallel_3",
        category: "Physics (Electricity & Magnetism)",
        title: "Capacitors in Parallel (3)",
        description: "Ceq = C1 + C2 + C3",
        inputs: [
            { label: "C1", key: "C1", type: "number", unit: "F", required: true },
            { label: "C2", key: "C2", type: "number", unit: "F", required: true },
            { label: "C3", key: "C3", type: "number", unit: "F", required: true }
        ],
        expression: "C1 + C2 + C3",
        output: { label: "Equivalent capacitance (Ceq)", unit: "F" },
        examples: [{ C1: 1e-6, C2: 2e-6, C3: 4e-6 }]
    },
    {
        id: "magnetic_force_on_charge",
        category: "Physics (Electricity & Magnetism)",
        title: "Magnetic Force (moving charge)",
        description: "F = q v B sin(theta), theta in radians",
        inputs: [
            { label: "Charge (q)", key: "q", type: "number", unit: "C", required: true },
            { label: "Speed (v)", key: "v", type: "number", unit: "m/s", required: true },
            { label: "Magnetic field (B)", key: "B", type: "number", unit: "T", required: true },
            { label: "Angle (theta)", key: "theta", type: "number", unit: "rad", required: true }
        ],
        expression: "q * v * B * sin(theta)",
        output: { label: "Force (F)", unit: "N" },
        examples: [{ q: 1.6e-19, v: 2e6, B: 0.2, theta: 1.57079632679 }]
    },
    {
        id: "magnetic_force_on_wire",
        category: "Physics (Electricity & Magnetism)",
        title: "Magnetic Force (current-carrying wire)",
        description: "F = B I L sin(theta), theta in radians",
        inputs: [
            { label: "Magnetic field (B)", key: "B", type: "number", unit: "T", required: true },
            { label: "Current (I)", key: "I", type: "number", unit: "A", required: true },
            { label: "Wire length (L)", key: "L", type: "number", unit: "m", required: true },
            { label: "Angle (theta)", key: "theta", type: "number", unit: "rad", required: true }
        ],
        expression: "B * I * L * sin(theta)",
        output: { label: "Force (F)", unit: "N" },
        examples: [{ B: 0.5, I: 3, L: 0.2, theta: 1.57079632679 }]
    },
    {
        id: "faradays_law_emf_avg",
        category: "Physics (Electricity & Magnetism)",
        title: "Faraday's Law (average emf)",
        description: "epsilon = N * abs(dPhi/dt)",
        inputs: [
            { label: "Turns (N)", key: "N", type: "number", unit: "", required: true },
            { label: "Change in flux (dPhi)", key: "dPhi", type: "number", unit: "Wb", required: true },
            { label: "Time change (dt)", key: "dt", type: "number", unit: "s", required: true }
        ],
        expression: "N * abs(dPhi / dt)",
        output: { label: "EMF (epsilon)", unit: "V" },
        examples: [{ N: 200, dPhi: 0.05, dt: 0.1 }]
    },
    {
        id: "inductor_energy",
        category: "Physics (Electricity & Magnetism)",
        title: "Energy in Inductor",
        description: "U = 1/2 L I^2",
        inputs: [
            { label: "Inductance (L)", key: "L", type: "number", unit: "H", required: true },
            { label: "Current (I)", key: "I", type: "number", unit: "A", required: true }
        ],
        expression: "0.5 * L * I^2",
        output: { label: "Energy (U)", unit: "J" },
        examples: [{ L: 0.2, I: 3 }]
    },

    // ============================================================
    // Physics (Thermodynamics)
    // ============================================================
    {
        id: "heat_energy_sensible",
        category: "Physics (Thermodynamics)",
        title: "Sensible Heat",
        description: "Q = m c dT",
        inputs: [
            { label: "Mass (m)", key: "m", type: "number", unit: "kg", required: true },
            { label: "Specific heat (c)", key: "c", type: "number", unit: "J/(kg·K)", required: true },
            { label: "Temperature change (dT)", key: "dT", type: "number", unit: "K", required: true }
        ],
        expression: "m * c * dT",
        output: { label: "Heat (Q)", unit: "J" },
        examples: [{ m: 1, c: 4186, dT: 10 }]
    },
    {
        id: "latent_heat",
        category: "Physics (Thermodynamics)",
        title: "Latent Heat",
        description: "Q = m L",
        inputs: [
            { label: "Mass (m)", key: "m", type: "number", unit: "kg", required: true },
            { label: "Specific latent heat (L)", key: "L", type: "number", unit: "J/kg", required: true }
        ],
        expression: "m * L",
        output: { label: "Heat (Q)", unit: "J" },
        examples: [{ m: 0.5, L: 334000 }]
    },
    {
        id: "ideal_gas_pressure",
        category: "Physics (Thermodynamics)",
        title: "Ideal Gas Law (pressure)",
        description: "P = n R T / V",
        inputs: [
            { label: "Moles (n)", key: "n", type: "number", unit: "mol", required: true },
            { label: "Gas constant (R)", key: "R", type: "number", unit: "J/(mol·K)", required: true },
            { label: "Temperature (T)", key: "T", type: "number", unit: "K", required: true },
            { label: "Volume (V)", key: "V", type: "number", unit: "m^3", required: true }
        ],
        expression: "n * R * T / V",
        output: { label: "Pressure (P)", unit: "Pa" },
        examples: [{ n: 1, R: 8.314, T: 300, V: 0.024 }]
    },
    {
        id: "ideal_gas_volume",
        category: "Physics (Thermodynamics)",
        title: "Ideal Gas Law (volume)",
        description: "V = n R T / P",
        inputs: [
            { label: "Moles (n)", key: "n", type: "number", unit: "mol", required: true },
            { label: "Gas constant (R)", key: "R", type: "number", unit: "J/(mol·K)", required: true },
            { label: "Temperature (T)", key: "T", type: "number", unit: "K", required: true },
            { label: "Pressure (P)", key: "P", type: "number", unit: "Pa", required: true }
        ],
        expression: "n * R * T / P",
        output: { label: "Volume (V)", unit: "m^3" },
        examples: [{ n: 1, R: 8.314, T: 300, P: 101325 }]
    },
    {
        id: "work_done_by_gas",
        category: "Physics (Thermodynamics)",
        title: "Work by Gas (constant pressure)",
        description: "W = P dV",
        inputs: [
            { label: "Pressure (P)", key: "P", type: "number", unit: "Pa", required: true },
            { label: "Change in volume (dV)", key: "dV", type: "number", unit: "m^3", required: true }
        ],
        expression: "P * dV",
        output: { label: "Work (W)", unit: "J" },
        examples: [{ P: 101325, dV: 0.01 }]
    },
    {
        id: "thermal_efficiency",
        category: "Physics (Thermodynamics)",
        title: "Thermal Efficiency",
        description: "eta = Wout/Qin",
        inputs: [
            { label: "Work output (Wout)", key: "Wout", type: "number", unit: "J", required: true },
            { label: "Heat input (Qin)", key: "Qin", type: "number", unit: "J", required: true }
        ],
        expression: "Wout / Qin",
        output: { label: "Efficiency (eta)", unit: "" },
        examples: [{ Wout: 300, Qin: 1000 }]
    },
    {
        id: "carnot_efficiency",
        category: "Physics (Thermodynamics)",
        title: "Carnot Efficiency",
        description: "eta = 1 - Tc/Th (temperatures in K)",
        inputs: [
            { label: "Cold reservoir temp (Tc)", key: "Tc", type: "number", unit: "K", required: true },
            { label: "Hot reservoir temp (Th)", key: "Th", type: "number", unit: "K", required: true }
        ],
        expression: "1 - (Tc / Th)",
        output: { label: "Efficiency (eta)", unit: "" },
        examples: [{ Tc: 300, Th: 600 }]
    },

    // ============================================================
    // Physics (Optics)
    // ============================================================
    {
        id: "refractive_index",
        category: "Physics (Optics)",
        title: "Refractive Index",
        description: "n = c/v",
        inputs: [
            { label: "Speed in vacuum (c)", key: "c", type: "number", unit: "m/s", required: true },
            { label: "Speed in medium (v)", key: "v", type: "number", unit: "m/s", required: true }
        ],
        expression: "c / v",
        output: { label: "Refractive index (n)", unit: "" },
        examples: [{ c: 3e8, v: 2e8 }]
    },
    {
        id: "snells_law_n2",
        category: "Physics (Optics)",
        title: "Snell's Law (solve n2)",
        description: "n2 = n1 sin(theta1)/sin(theta2), radians",
        inputs: [
            { label: "n1", key: "n1", type: "number", unit: "", required: true },
            { label: "Angle theta1", key: "theta1", type: "number", unit: "rad", required: true },
            { label: "Angle theta2", key: "theta2", type: "number", unit: "rad", required: true }
        ],
        expression: "n1 * sin(theta1) / sin(theta2)",
        output: { label: "n2", unit: "" },
        examples: [{ n1: 1, theta1: 0.5235987756, theta2: 0.3398369095 }]
    },
    {
        id: "thin_lens_focal_length",
        category: "Physics (Optics)",
        title: "Thin Lens (solve f)",
        description: "f = 1/(1/v + 1/u)",
        inputs: [
            { label: "Image distance (v)", key: "v", type: "number", unit: "m", required: true },
            { label: "Object distance (u)", key: "u", type: "number", unit: "m", required: true }
        ],
        expression: "1 / (1/v + 1/u)",
        output: { label: "Focal length (f)", unit: "m" },
        examples: [{ u: 0.3, v: 0.6 }]
    },
    {
        id: "magnification_lens",
        category: "Physics (Optics)",
        title: "Magnification",
        description: "m = v/u",
        inputs: [
            { label: "Image distance (v)", key: "v", type: "number", unit: "m", required: true },
            { label: "Object distance (u)", key: "u", type: "number", unit: "m", required: true }
        ],
        expression: "v / u",
        output: { label: "Magnification (m)", unit: "" },
        examples: [{ u: 0.2, v: 0.4 }]
    },

    // ============================================================
    // Physics (Modern)
    // ============================================================
    {
        id: "mass_energy_equivalence",
        category: "Physics (Modern)",
        title: "Mass–Energy",
        description: "E = m c^2",
        inputs: [
            { label: "Mass (m)", key: "m", type: "number", unit: "kg", required: true },
            { label: "Speed of light (c)", key: "c", type: "number", unit: "m/s", required: true }
        ],
        expression: "m * c^2",
        output: { label: "Energy (E)", unit: "J" },
        examples: [{ m: 0.001, c: 3e8 }]
    },
    {
        id: "photon_energy",
        category: "Physics (Modern)",
        title: "Photon Energy",
        description: "E = h f",
        inputs: [
            { label: "Planck constant (h)", key: "h", type: "number", unit: "J·s", required: true },
            { label: "Frequency (f)", key: "f", type: "number", unit: "Hz", required: true }
        ],
        expression: "h * f",
        output: { label: "Energy (E)", unit: "J" },
        examples: [{ h: 6.626e-34, f: 5e14 }]
    },
    {
        id: "photon_energy_from_wavelength",
        category: "Physics (Modern)",
        title: "Photon Energy (from wavelength)",
        description: "E = h c / lambda",
        inputs: [
            { label: "Planck constant (h)", key: "h", type: "number", unit: "J·s", required: true },
            { label: "Speed of light (c)", key: "c", type: "number", unit: "m/s", required: true },
            { label: "Wavelength (lambda)", key: "lambda", type: "number", unit: "m", required: true }
        ],
        expression: "h * c / lambda",
        output: { label: "Energy (E)", unit: "J" },
        examples: [{ h: 6.626e-34, c: 3e8, lambda: 500e-9 }]
    },
    {
        id: "de_broglie_wavelength",
        category: "Physics (Modern)",
        title: "de Broglie Wavelength",
        description: "lambda = h/p",
        inputs: [
            { label: "Planck constant (h)", key: "h", type: "number", unit: "J·s", required: true },
            { label: "Momentum (p)", key: "p", type: "number", unit: "kg·m/s", required: true }
        ],
        expression: "h / p",
        output: { label: "Wavelength (lambda)", unit: "m" },
        examples: [{ h: 6.626e-34, p: 1e-24 }]
    },

    // ============================================================
    // Mathematics (Algebra)
    // ============================================================
    {
        id: "linear_equation_y",
        category: "Mathematics (Algebra)",
        title: "Line Equation",
        description: "y = mx + c",
        inputs: [
            { label: "Slope (m)", key: "m", type: "number", unit: "", required: true },
            { label: "x", key: "x", type: "number", unit: "", required: true },
            { label: "Intercept (c)", key: "c", type: "number", unit: "", required: true }
        ],
        expression: "m * x + c",
        output: { label: "y", unit: "" },
        examples: [{ m: 2, x: 3, c: 1 }]
    },
    {
        id: "slope_two_points",
        category: "Mathematics (Algebra)",
        title: "Slope (two points)",
        description: "m = (y2 - y1)/(x2 - x1)",
        inputs: [
            { label: "x1", key: "x1", type: "number", unit: "", required: true },
            { label: "y1", key: "y1", type: "number", unit: "", required: true },
            { label: "x2", key: "x2", type: "number", unit: "", required: true },
            { label: "y2", key: "y2", type: "number", unit: "", required: true }
        ],
        expression: "(y2 - y1) / (x2 - x1)",
        output: { label: "Slope (m)", unit: "" },
        examples: [{ x1: 1, y1: 2, x2: 3, y2: 8 }]
    },
    {
        id: "quadratic_discriminant",
        category: "Mathematics (Algebra)",
        title: "Discriminant",
        description: "Delta = b^2 - 4ac",
        inputs: [
            { label: "a", key: "a", type: "number", unit: "", required: true },
            { label: "b", key: "b", type: "number", unit: "", required: true },
            { label: "c", key: "c", type: "number", unit: "", required: true }
        ],
        expression: "b^2 - 4*a*c",
        output: { label: "Discriminant (Delta)", unit: "" },
        examples: [{ a: 1, b: -3, c: 2 }]
    },
    {
        id: "quadratic_root_1",
        category: "Mathematics (Algebra)",
        title: "Quadratic Root (plus)",
        description: "x = (-b + sqrt(b^2-4ac)) / (2a)",
        inputs: [
            { label: "a", key: "a", type: "number", unit: "", required: true },
            { label: "b", key: "b", type: "number", unit: "", required: true },
            { label: "c", key: "c", type: "number", unit: "", required: true }
        ],
        expression: "(-b + sqrt(b^2 - 4*a*c)) / (2*a)",
        output: { label: "Root (x1)", unit: "" },
        examples: [{ a: 1, b: -3, c: 2 }]
    },
    {
        id: "quadratic_root_2",
        category: "Mathematics (Algebra)",
        title: "Quadratic Root (minus)",
        description: "x = (-b - sqrt(b^2-4ac)) / (2a)",
        inputs: [
            { label: "a", key: "a", type: "number", unit: "", required: true },
            { label: "b", key: "b", type: "number", unit: "", required: true },
            { label: "c", key: "c", type: "number", unit: "", required: true }
        ],
        expression: "(-b - sqrt(b^2 - 4*a*c)) / (2*a)",
        output: { label: "Root (x2)", unit: "" },
        examples: [{ a: 1, b: -3, c: 2 }]
    },
    {
        id: "arithmetic_sequence_nth",
        category: "Mathematics (Algebra)",
        title: "Arithmetic n-th term",
        description: "a_n = a1 + (n-1)d",
        inputs: [
            { label: "First term (a1)", key: "a1", type: "number", unit: "", required: true },
            { label: "Common difference (d)", key: "d", type: "number", unit: "", required: true },
            { label: "n", key: "n", type: "number", unit: "", required: true }
        ],
        expression: "a1 + (n - 1) * d",
        output: { label: "a_n", unit: "" },
        examples: [{ a1: 3, d: 2, n: 10 }]
    },
    {
        id: "arithmetic_series_sum",
        category: "Mathematics (Algebra)",
        title: "Arithmetic sum",
        description: "S_n = n/2 * (2a1 + (n-1)d)",
        inputs: [
            { label: "First term (a1)", key: "a1", type: "number", unit: "", required: true },
            { label: "Common difference (d)", key: "d", type: "number", unit: "", required: true },
            { label: "n", key: "n", type: "number", unit: "", required: true }
        ],
        expression: "n/2 * (2*a1 + (n - 1)*d)",
        output: { label: "Sum (S_n)", unit: "" },
        examples: [{ a1: 1, d: 1, n: 100 }]
    },
    {
        id: "geometric_sequence_nth",
        category: "Mathematics (Algebra)",
        title: "Geometric n-th term",
        description: "a_n = a1 * r^(n-1)",
        inputs: [
            { label: "First term (a1)", key: "a1", type: "number", unit: "", required: true },
            { label: "Common ratio (r)", key: "r", type: "number", unit: "", required: true },
            { label: "n", key: "n", type: "number", unit: "", required: true }
        ],
        expression: "a1 * r^(n - 1)",
        output: { label: "a_n", unit: "" },
        examples: [{ a1: 2, r: 3, n: 5 }]
    },
    {
        id: "geometric_series_sum",
        category: "Mathematics (Algebra)",
        title: "Geometric sum (finite)",
        description: "S_n = a1 (1 - r^n)/(1 - r), r != 1",
        inputs: [
            { label: "First term (a1)", key: "a1", type: "number", unit: "", required: true },
            { label: "Common ratio (r)", key: "r", type: "number", unit: "", required: true },
            { label: "n", key: "n", type: "number", unit: "", required: true }
        ],
        expression: "a1 * (1 - r^n) / (1 - r)",
        output: { label: "Sum (S_n)", unit: "" },
        examples: [{ a1: 1, r: 0.5, n: 10 }]
    },
    {
        id: "compound_interest",
        category: "Mathematics (Algebra)",
        title: "Compound Interest",
        description: "A = P (1 + r/n)^(n t)",
        inputs: [
            { label: "Principal (P)", key: "P", type: "number", unit: "", required: true },
            { label: "Annual rate (r)", key: "r", type: "number", unit: "", required: true },
            { label: "Compounds per year (n)", key: "n", type: "number", unit: "", required: true },
            { label: "Years (t)", key: "t", type: "number", unit: "year", required: true }
        ],
        expression: "P * (1 + r/n)^(n * t)",
        output: { label: "Amount (A)", unit: "" },
        examples: [{ P: 1000, r: 0.08, n: 12, t: 5 }]
    },
    {
        id: "log_change_of_base",
        category: "Mathematics (Algebra)",
        title: "Log base-b of x",
        description: "log_b(x) = log(x)/log(b) using natural logs",
        inputs: [
            { label: "x", key: "x", type: "number", unit: "", required: true },
            { label: "Base (b)", key: "b", type: "number", unit: "", required: true }
        ],
        expression: "log(x) / log(b)",
        output: { label: "log_b(x)", unit: "" },
        examples: [{ x: 8, b: 2 }]
    },

    // ============================================================
    // Mathematics (Geometry)
    // ============================================================
    {
        id: "pythagorean_hypotenuse",
        category: "Mathematics (Geometry)",
        title: "Pythagorean (hypotenuse)",
        description: "c = sqrt(a^2 + b^2)",
        inputs: [
            { label: "Side a", key: "a", type: "number", unit: "", required: true },
            { label: "Side b", key: "b", type: "number", unit: "", required: true }
        ],
        expression: "sqrt(a^2 + b^2)",
        output: { label: "Hypotenuse (c)", unit: "" },
        examples: [{ a: 3, b: 4 }]
    },
    {
        id: "area_triangle_base_height",
        category: "Mathematics (Geometry)",
        title: "Triangle Area",
        description: "A = 1/2 b h",
        inputs: [
            { label: "Base (b)", key: "b", type: "number", unit: "", required: true },
            { label: "Height (h)", key: "h", type: "number", unit: "", required: true }
        ],
        expression: "0.5 * b * h",
        output: { label: "Area (A)", unit: "square units" },
        examples: [{ b: 10, h: 6 }]
    },
    {
        id: "area_circle",
        category: "Mathematics (Geometry)",
        title: "Circle Area",
        description: "A = pi r^2",
        inputs: [{ label: "Radius (r)", key: "r", type: "number", unit: "", required: true }],
        expression: "pi * r^2",
        output: { label: "Area (A)", unit: "square units" },
        examples: [{ r: 7 }]
    },
    {
        id: "circumference_circle",
        category: "Mathematics (Geometry)",
        title: "Circle Circumference",
        description: "C = 2 pi r",
        inputs: [{ label: "Radius (r)", key: "r", type: "number", unit: "", required: true }],
        expression: "2 * pi * r",
        output: { label: "Circumference (C)", unit: "units" },
        examples: [{ r: 7 }]
    },
    {
        id: "area_rectangle",
        category: "Mathematics (Geometry)",
        title: "Rectangle Area",
        description: "A = l w",
        inputs: [
            { label: "Length (l)", key: "l", type: "number", unit: "", required: true },
            { label: "Width (w)", key: "w", type: "number", unit: "", required: true }
        ],
        expression: "l * w",
        output: { label: "Area (A)", unit: "square units" },
        examples: [{ l: 8, w: 5 }]
    },
    {
        id: "area_trapezoid",
        category: "Mathematics (Geometry)",
        title: "Trapezoid Area",
        description: "A = (a+b)/2 * h",
        inputs: [
            { label: "Base a", key: "a", type: "number", unit: "", required: true },
            { label: "Base b", key: "b", type: "number", unit: "", required: true },
            { label: "Height (h)", key: "h", type: "number", unit: "", required: true }
        ],
        expression: "((a + b) / 2) * h",
        output: { label: "Area (A)", unit: "square units" },
        examples: [{ a: 6, b: 10, h: 4 }]
    },
    {
        id: "volume_cylinder",
        category: "Mathematics (Geometry)",
        title: "Cylinder Volume",
        description: "V = pi r^2 h",
        inputs: [
            { label: "Radius (r)", key: "r", type: "number", unit: "", required: true },
            { label: "Height (h)", key: "h", type: "number", unit: "", required: true }
        ],
        expression: "pi * r^2 * h",
        output: { label: "Volume (V)", unit: "cubic units" },
        examples: [{ r: 3, h: 10 }]
    },
    {
        id: "volume_sphere",
        category: "Mathematics (Geometry)",
        title: "Sphere Volume",
        description: "V = 4/3 pi r^3",
        inputs: [{ label: "Radius (r)", key: "r", type: "number", unit: "", required: true }],
        expression: "4/3 * pi * r^3",
        output: { label: "Volume (V)", unit: "cubic units" },
        examples: [{ r: 2 }]
    },
    {
        id: "distance_2d",
        category: "Mathematics (Geometry)",
        title: "Distance (2D)",
        description: "d = sqrt((x2-x1)^2 + (y2-y1)^2)",
        inputs: [
            { label: "x1", key: "x1", type: "number", unit: "", required: true },
            { label: "y1", key: "y1", type: "number", unit: "", required: true },
            { label: "x2", key: "x2", type: "number", unit: "", required: true },
            { label: "y2", key: "y2", type: "number", unit: "", required: true }
        ],
        expression: "sqrt((x2 - x1)^2 + (y2 - y1)^2)",
        output: { label: "Distance (d)", unit: "" },
        examples: [{ x1: 0, y1: 0, x2: 3, y2: 4 }]
    },
    {
        id: "midpoint_x",
        category: "Mathematics (Geometry)",
        title: "Midpoint x-coordinate",
        description: "Mx = (x1 + x2)/2",
        inputs: [
            { label: "x1", key: "x1", type: "number", unit: "", required: true },
            { label: "x2", key: "x2", type: "number", unit: "", required: true }
        ],
        expression: "(x1 + x2) / 2",
        output: { label: "Mx", unit: "" },
        examples: [{ x1: 2, x2: 8 }]
    },
    {
        id: "midpoint_y",
        category: "Mathematics (Geometry)",
        title: "Midpoint y-coordinate",
        description: "My = (y1 + y2)/2",
        inputs: [
            { label: "y1", key: "y1", type: "number", unit: "", required: true },
            { label: "y2", key: "y2", type: "number", unit: "", required: true }
        ],
        expression: "(y1 + y2) / 2",
        output: { label: "My", unit: "" },
        examples: [{ y1: -1, y2: 5 }]
    },

    // ============================================================
    // Mathematics (Trigonometry)
    // ============================================================
    {
        id: "degrees_to_radians",
        category: "Mathematics (Trigonometry)",
        title: "Degrees to Radians",
        description: "rad = deg * pi/180",
        inputs: [{ label: "Degrees (deg)", key: "deg", type: "number", unit: "deg", required: true }],
        expression: "deg * pi / 180",
        output: { label: "Radians (rad)", unit: "rad" },
        examples: [{ deg: 180 }]
    },
    {
        id: "radians_to_degrees",
        category: "Mathematics (Trigonometry)",
        title: "Radians to Degrees",
        description: "deg = rad * 180/pi",
        inputs: [{ label: "Radians (rad)", key: "rad", type: "number", unit: "rad", required: true }],
        expression: "rad * 180 / pi",
        output: { label: "Degrees (deg)", unit: "deg" },
        examples: [{ rad: 3.14159265359 }]
    },
    {
        id: "right_triangle_sin",
        category: "Mathematics (Trigonometry)",
        title: "sin(theta)",
        description: "sin(theta) = opposite/hypotenuse",
        inputs: [
            { label: "Opposite", key: "opp", type: "number", unit: "", required: true },
            { label: "Hypotenuse", key: "hyp", type: "number", unit: "", required: true }
        ],
        expression: "opp / hyp",
        output: { label: "sin(theta)", unit: "" },
        examples: [{ opp: 3, hyp: 5 }]
    },
    {
        id: "right_triangle_cos",
        category: "Mathematics (Trigonometry)",
        title: "cos(theta)",
        description: "cos(theta) = adjacent/hypotenuse",
        inputs: [
            { label: "Adjacent", key: "adj", type: "number", unit: "", required: true },
            { label: "Hypotenuse", key: "hyp", type: "number", unit: "", required: true }
        ],
        expression: "adj / hyp",
        output: { label: "cos(theta)", unit: "" },
        examples: [{ adj: 4, hyp: 5 }]
    },
    {
        id: "right_triangle_tan",
        category: "Mathematics (Trigonometry)",
        title: "tan(theta)",
        description: "tan(theta) = opposite/adjacent",
        inputs: [
            { label: "Opposite", key: "opp", type: "number", unit: "", required: true },
            { label: "Adjacent", key: "adj", type: "number", unit: "", required: true }
        ],
        expression: "opp / adj",
        output: { label: "tan(theta)", unit: "" },
        examples: [{ opp: 3, adj: 4 }]
    },
    {
        id: "law_of_sines_side_a",
        category: "Mathematics (Trigonometry)",
        title: "Law of Sines (solve a)",
        description: "a = b sin(A)/sin(B), radians",
        inputs: [
            { label: "Side b", key: "b", type: "number", unit: "", required: true },
            { label: "Angle A", key: "A", type: "number", unit: "rad", required: true },
            { label: "Angle B", key: "B", type: "number", unit: "rad", required: true }
        ],
        expression: "b * sin(A) / sin(B)",
        output: { label: "Side a", unit: "" },
        examples: [{ b: 10, A: 0.6981317008, B: 0.5235987756 }]
    },
    {
        id: "law_of_cosines_side_c",
        category: "Mathematics (Trigonometry)",
        title: "Law of Cosines (solve c)",
        description: "c = sqrt(a^2 + b^2 - 2ab cos(C)), radians",
        inputs: [
            { label: "Side a", key: "a", type: "number", unit: "", required: true },
            { label: "Side b", key: "b", type: "number", unit: "", required: true },
            { label: "Angle C", key: "C", type: "number", unit: "rad", required: true }
        ],
        expression: "sqrt(a^2 + b^2 - 2*a*b*cos(C))",
        output: { label: "Side c", unit: "" },
        examples: [{ a: 5, b: 7, C: 1.0471975512 }]
    },
    {
        id: "triangle_area_two_sides_angle",
        category: "Mathematics (Trigonometry)",
        title: "Triangle Area (ab, C)",
        description: "Area = 1/2 ab sin(C), radians",
        inputs: [
            { label: "Side a", key: "a", type: "number", unit: "", required: true },
            { label: "Side b", key: "b", type: "number", unit: "", required: true },
            { label: "Angle C", key: "C", type: "number", unit: "rad", required: true }
        ],
        expression: "0.5 * a * b * sin(C)",
        output: { label: "Area", unit: "square units" },
        examples: [{ a: 6, b: 8, C: 0.78539816339 }]
    },

    // ============================================================
    // Mathematics (Calculus)
    // ============================================================
    {
        id: "difference_quotient",
        category: "Mathematics (Calculus)",
        title: "Difference Quotient",
        description: "(f(x+h) - f(x))/h",
        inputs: [
            { label: "f(x+h)", key: "fxh", type: "number", unit: "", required: true },
            { label: "f(x)", key: "fx", type: "number", unit: "", required: true },
            { label: "h", key: "h", type: "number", unit: "", required: true }
        ],
        expression: "(fxh - fx) / h",
        output: { label: "Approx derivative", unit: "" },
        examples: [{ fxh: 10.5, fx: 10, h: 0.5 }]
    },
    {
        id: "derivative_power_rule_value",
        category: "Mathematics (Calculus)",
        title: "Derivative of a*x^n",
        description: "d/dx(a x^n) = a n x^(n-1)",
        inputs: [
            { label: "Coefficient (a)", key: "a", type: "number", unit: "", required: true },
            { label: "Power (n)", key: "n", type: "number", unit: "", required: true },
            { label: "x", key: "x", type: "number", unit: "", required: true }
        ],
        expression: "a * n * x^(n - 1)",
        output: { label: "f'(x)", unit: "" },
        examples: [{ a: 3, n: 4, x: 2 }]
    },
    {
        id: "integral_power_rule_value_no_c",
        category: "Mathematics (Calculus)",
        title: "Integral of a*x^n (no +C)",
        description: "∫ a x^n dx = a x^(n+1)/(n+1), n != -1",
        inputs: [
            { label: "Coefficient (a)", key: "a", type: "number", unit: "", required: true },
            { label: "Power (n)", key: "n", type: "number", unit: "", required: true },
            { label: "x", key: "x", type: "number", unit: "", required: true }
        ],
        expression: "a * x^(n + 1) / (n + 1)",
        output: { label: "Antiderivative value", unit: "" },
        examples: [{ a: 2, n: 3, x: 5 }]
    },
    {
        id: "trapezoidal_rule_single_interval",
        category: "Mathematics (Calculus)",
        title: "Trapezoidal Rule (1 interval)",
        description: "Integral ≈ (b-a)*(f(a)+f(b))/2",
        inputs: [
            { label: "Lower limit (a)", key: "a", type: "number", unit: "", required: true },
            { label: "Upper limit (b)", key: "b", type: "number", unit: "", required: true },
            { label: "f(a)", key: "fa", type: "number", unit: "", required: true },
            { label: "f(b)", key: "fb", type: "number", unit: "", required: true }
        ],
        expression: "(b - a) * (fa + fb) / 2",
        output: { label: "Integral approx", unit: "" },
        examples: [{ a: 0, b: 2, fa: 1, fb: 5 }]
    },

    // ============================================================
    // Mathematics (Statistics & Probability)
    // ============================================================
    {
        id: "mean_from_sum",
        category: "Mathematics (Statistics & Probability)",
        title: "Mean (from sum)",
        description: "mean = sum/n",
        inputs: [
            { label: "Sum (sum)", key: "sum", type: "number", unit: "", required: true },
            { label: "Count (n)", key: "n", type: "number", unit: "", required: true }
        ],
        expression: "sum / n",
        output: { label: "Mean", unit: "" },
        examples: [{ sum: 55, n: 10 }]
    },
    {
        id: "weighted_mean_from_sums",
        category: "Mathematics (Statistics & Probability)",
        title: "Weighted Mean (from sums)",
        description: "xbar = sum_wx/sum_w",
        inputs: [
            { label: "Sum of w*x (sum_wx)", key: "sum_wx", type: "number", unit: "", required: true },
            { label: "Sum of weights (sum_w)", key: "sum_w", type: "number", unit: "", required: true }
        ],
        expression: "sum_wx / sum_w",
        output: { label: "Weighted mean", unit: "" },
        examples: [{ sum_wx: 86, sum_w: 20 }]
    },
    {
        id: "population_variance_from_sums",
        category: "Mathematics (Statistics & Probability)",
        title: "Population Variance (from sums)",
        description: "Var = sum_x2/n - (sum_x/n)^2",
        inputs: [
            { label: "Sum of squares (sum_x2)", key: "sum_x2", type: "number", unit: "", required: true },
            { label: "Sum (sum_x)", key: "sum_x", type: "number", unit: "", required: true },
            { label: "Count (n)", key: "n", type: "number", unit: "", required: true }
        ],
        expression: "sum_x2 / n - (sum_x / n)^2",
        output: { label: "Variance (Var)", unit: "" },
        examples: [{ sum_x2: 385, sum_x: 55, n: 10 }]
    },
    {
        id: "standard_deviation_from_variance",
        category: "Mathematics (Statistics & Probability)",
        title: "Standard Deviation",
        description: "sigma = sqrt(Var)",
        inputs: [{ label: "Variance (Var)", key: "Var", type: "number", unit: "", required: true }],
        expression: "sqrt(Var)",
        output: { label: "Std dev (sigma)", unit: "" },
        examples: [{ Var: 4 }]
    },
    {
        id: "z_score",
        category: "Mathematics (Statistics & Probability)",
        title: "Z-score",
        description: "z = (x - mu)/sigma",
        inputs: [
            { label: "Value (x)", key: "x", type: "number", unit: "", required: true },
            { label: "Mean (mu)", key: "mu", type: "number", unit: "", required: true },
            { label: "Std dev (sigma)", key: "sigma", type: "number", unit: "", required: true }
        ],
        expression: "(x - mu) / sigma",
        output: { label: "z", unit: "" },
        examples: [{ x: 85, mu: 70, sigma: 10 }]
    },
    {
        id: "npr",
        category: "Mathematics (Statistics & Probability)",
        title: "Permutations (nPr)",
        description: "nPr = n!/(n-r)!",
        inputs: [
            { label: "n", key: "n", type: "number", unit: "", required: true },
            { label: "r", key: "r", type: "number", unit: "", required: true }
        ],
        expression: "factorial(n) / factorial(n - r)",
        output: { label: "nPr", unit: "" },
        examples: [{ n: 10, r: 3 }]
    },
    {
        id: "ncr",
        category: "Mathematics (Statistics & Probability)",
        title: "Combinations (nCr)",
        description: "nCr = n!/(r!(n-r)!)",
        inputs: [
            { label: "n", key: "n", type: "number", unit: "", required: true },
            { label: "r", key: "r", type: "number", unit: "", required: true }
        ],
        expression: "factorial(n) / (factorial(r) * factorial(n - r))",
        output: { label: "nCr", unit: "" },
        examples: [{ n: 10, r: 3 }]
    },
    {
        id: "binomial_pmf",
        category: "Mathematics (Statistics & Probability)",
        title: "Binomial P(X=k)",
        description: "P = nCk p^k (1-p)^(n-k)",
        inputs: [
            { label: "Trials (n)", key: "n", type: "number", unit: "", required: true },
            { label: "Successes (k)", key: "k", type: "number", unit: "", required: true },
            { label: "Success prob (p)", key: "p", type: "number", unit: "", required: true }
        ],
        expression: "factorial(n) / (factorial(k) * factorial(n - k)) * p^k * (1 - p)^(n - k)",
        output: { label: "Probability", unit: "" },
        examples: [{ n: 5, k: 2, p: 0.3 }]
    },

    // ============================================================
    // Mathematics (Linear Algebra)
    // ============================================================
    {
        id: "dot_product_2d",
        category: "Mathematics (Linear Algebra)",
        title: "Dot Product (2D)",
        description: "a·b = a1b1 + a2b2",
        inputs: [
            { label: "a1", key: "a1", type: "number", unit: "", required: true },
            { label: "a2", key: "a2", type: "number", unit: "", required: true },
            { label: "b1", key: "b1", type: "number", unit: "", required: true },
            { label: "b2", key: "b2", type: "number", unit: "", required: true }
        ],
        expression: "a1*b1 + a2*b2",
        output: { label: "Dot product", unit: "" },
        examples: [{ a1: 1, a2: 2, b1: 3, b2: 4 }]
    },
    {
        id: "vector_magnitude_2d",
        category: "Mathematics (Linear Algebra)",
        title: "Vector Magnitude (2D)",
        description: "||v|| = sqrt(x^2 + y^2)",
        inputs: [
            { label: "x", key: "x", type: "number", unit: "", required: true },
            { label: "y", key: "y", type: "number", unit: "", required: true }
        ],
        expression: "sqrt(x^2 + y^2)",
        output: { label: "Magnitude", unit: "" },
        examples: [{ x: 3, y: 4 }]
    },
    {
        id: "determinant_2x2",
        category: "Mathematics (Linear Algebra)",
        title: "Determinant (2x2)",
        description: "det = ad - bc",
        inputs: [
            { label: "a", key: "a", type: "number", unit: "", required: true },
            { label: "b", key: "b", type: "number", unit: "", required: true },
            { label: "c", key: "c", type: "number", unit: "", required: true },
            { label: "d", key: "d", type: "number", unit: "", required: true }
        ],
        expression: "a*d - b*c",
        output: { label: "det", unit: "" },
        examples: [{ a: 1, b: 2, c: 3, d: 4 }]
    },

    // ============================================================
    // Computer Science (Theory)
    // ============================================================
    {
        id: "shannon_entropy_bernoulli_bits",
        category: "Computer Science (Theory)",
        title: "Shannon Entropy (Bernoulli)",
        description: "H(p) = -p log2(p) - (1-p) log2(1-p)",
        inputs: [{ label: "Probability (p)", key: "p", type: "number", unit: "", required: true }],
        expression: "-p*(log(p)/log(2)) - (1 - p)*(log(1 - p)/log(2))",
        output: { label: "Entropy (H)", unit: "bits" },
        examples: [{ p: 0.5 }]
    },
    {
        id: "amdahls_law_speedup",
        category: "Computer Science (Theory)",
        title: "Amdahl's Law",
        description: "Speedup = 1/((1-p) + p/s)",
        inputs: [
            { label: "Parallel fraction (p)", key: "p", type: "number", unit: "", required: true },
            { label: "Speedup of parallel part (s)", key: "s", type: "number", unit: "", required: true }
        ],
        expression: "1 / ((1 - p) + p / s)",
        output: { label: "Overall speedup", unit: "" },
        examples: [{ p: 0.9, s: 8 }]
    },
    {
        id: "gustafsons_law_speedup",
        category: "Computer Science (Theory)",
        title: "Gustafson's Law",
        description: "Speedup = s - (s-1)(1-p)",
        inputs: [
            { label: "Processors (s)", key: "s", type: "number", unit: "", required: true },
            { label: "Parallel fraction (p)", key: "p", type: "number", unit: "", required: true }
        ],
        expression: "s - (s - 1) * (1 - p)",
        output: { label: "Scaled speedup", unit: "" },
        examples: [{ s: 8, p: 0.9 }]
    },

    // ============================================================
    // Computer Science (Networking)
    // ============================================================
    {
        id: "bandwidth_delay_product",
        category: "Computer Science (Networking)",
        title: "Bandwidth-Delay Product",
        description: "BDP = bandwidth * RTT",
        inputs: [
            { label: "Bandwidth (bw)", key: "bw", type: "number", unit: "bits/s", required: true },
            { label: "RTT (rtt)", key: "rtt", type: "number", unit: "s", required: true }
        ],
        expression: "bw * rtt",
        output: { label: "BDP", unit: "bits" },
        examples: [{ bw: 100e6, rtt: 0.05 }]
    },
    {
        id: "transmission_delay",
        category: "Computer Science (Networking)",
        title: "Transmission Delay",
        description: "tx_delay = packet_bits / bitrate",
        inputs: [
            { label: "Packet size (bits)", key: "packet_bits", type: "number", unit: "bits", required: true },
            { label: "Bitrate (rate)", key: "rate", type: "number", unit: "bits/s", required: true }
        ],
        expression: "packet_bits / rate",
        output: { label: "Transmission delay", unit: "s" },
        examples: [{ packet_bits: 12000, rate: 1e6 }]
    },
    {
        id: "propagation_delay",
        category: "Computer Science (Networking)",
        title: "Propagation Delay",
        description: "prop_delay = distance / propagation_speed",
        inputs: [
            { label: "Distance", key: "distance", type: "number", unit: "m", required: true },
            { label: "Propagation speed", key: "speed", type: "number", unit: "m/s", required: true }
        ],
        expression: "distance / speed",
        output: { label: "Propagation delay", unit: "s" },
        examples: [{ distance: 100000, speed: 2e8 }]
    },

    // ============================================================
    // Computer Science (Algorithms)
    // ============================================================
    {
        id: "hash_table_load_factor",
        category: "Computer Science (Algorithms)",
        title: "Hash Table Load Factor",
        description: "alpha = n/m",
        inputs: [
            { label: "Elements (n)", key: "n", type: "number", unit: "", required: true },
            { label: "Buckets (m)", key: "m", type: "number", unit: "", required: true }
        ],
        expression: "n / m",
        output: { label: "Load factor (alpha)", unit: "" },
        examples: [{ n: 750, m: 1000 }]
    },
    {
        id: "binary_search_mid_index",
        category: "Computer Science (Algorithms)",
        title: "Binary Search Mid",
        description: "mid = floor((low + high)/2) (approx using (low+high)/2)",
        inputs: [
            { label: "Low index (low)", key: "low", type: "number", unit: "", required: true },
            { label: "High index (high)", key: "high", type: "number", unit: "", required: true }
        ],
        expression: "(low + high) / 2",
        output: { label: "Mid (non-integer possible)", unit: "" },
        examples: [{ low: 0, high: 99 }]
    },

    // ============================================================
    // AI/ML (Core)
    // ============================================================
    {
        id: "linear_model_prediction_2f",
        category: "AI/ML (Core)",
        title: "Linear Model (2 features)",
        description: "y_hat = w1 x1 + w2 x2 + b",
        inputs: [
            { label: "w1", key: "w1", type: "number", unit: "", required: true },
            { label: "x1", key: "x1", type: "number", unit: "", required: true },
            { label: "w2", key: "w2", type: "number", unit: "", required: true },
            { label: "x2", key: "x2", type: "number", unit: "", required: true },
            { label: "Bias (b)", key: "b", type: "number", unit: "", required: true }
        ],
        expression: "w1*x1 + w2*x2 + b",
        output: { label: "Prediction (y_hat)", unit: "" },
        examples: [{ w1: 2, x1: 1.5, w2: -1, x2: 3, b: 0.1 }]
    },
    {
        id: "sigmoid",
        category: "AI/ML (Core)",
        title: "Sigmoid",
        description: "sigmoid(x) = 1/(1+e^(-x))",
        inputs: [{ label: "x", key: "x", type: "number", unit: "", required: true }],
        expression: "1 / (1 + e^(-x))",
        output: { label: "sigmoid(x)", unit: "" },
        examples: [{ x: 0 }]
    },
    {
        id: "softmax_prob_class1_2class",
        category: "AI/ML (Core)",
        title: "Softmax (2-class, p1)",
        description: "p1 = e^z1 / (e^z1 + e^z2)",
        inputs: [
            { label: "Logit z1", key: "z1", type: "number", unit: "", required: true },
            { label: "Logit z2", key: "z2", type: "number", unit: "", required: true }
        ],
        expression: "e^z1 / (e^z1 + e^z2)",
        output: { label: "Probability p1", unit: "" },
        examples: [{ z1: 1.2, z2: 0.3 }]
    },
    {
        id: "mse_from_sse",
        category: "AI/ML (Core)",
        title: "MSE (from SSE)",
        description: "MSE = SSE/n",
        inputs: [
            { label: "SSE", key: "SSE", type: "number", unit: "", required: true },
            { label: "n", key: "n", type: "number", unit: "", required: true }
        ],
        expression: "SSE / n",
        output: { label: "MSE", unit: "" },
        examples: [{ SSE: 25, n: 10 }]
    },
    {
        id: "rmse_from_mse",
        category: "AI/ML (Core)",
        title: "RMSE",
        description: "RMSE = sqrt(MSE)",
        inputs: [{ label: "MSE", key: "MSE", type: "number", unit: "", required: true }],
        expression: "sqrt(MSE)",
        output: { label: "RMSE", unit: "" },
        examples: [{ MSE: 4 }]
    },
    {
        id: "binary_cross_entropy_single",
        category: "AI/ML (Core)",
        title: "Binary Cross-Entropy",
        description: "L = -(y log(p) + (1-y) log(1-p))",
        inputs: [
            { label: "Target (y)", key: "y", type: "number", unit: "", required: true },
            { label: "Predicted prob (p)", key: "p", type: "number", unit: "", required: true }
        ],
        expression: "-(y*log(p) + (1 - y)*log(1 - p))",
        output: { label: "Loss (L)", unit: "" },
        examples: [{ y: 1, p: 0.8 }]
    },
    {
        id: "l2_regularization_2w",
        category: "AI/ML (Core)",
        title: "L2 Regularization (2 weights)",
        description: "lambda/2 * (w1^2 + w2^2)",
        inputs: [
            { label: "lambda", key: "lambda", type: "number", unit: "", required: true },
            { label: "w1", key: "w1", type: "number", unit: "", required: true },
            { label: "w2", key: "w2", type: "number", unit: "", required: true }
        ],
        expression: "lambda/2 * (w1^2 + w2^2)",
        output: { label: "Regularization term", unit: "" },
        examples: [{ lambda: 0.1, w1: 2, w2: -3 }]
    },
    {
        id: "cosine_similarity_2d",
        category: "AI/ML (Core)",
        title: "Cosine Similarity (2D)",
        description: "cos = (a·b)/(||a|| ||b||)",
        inputs: [
            { label: "a1", key: "a1", type: "number", unit: "", required: true },
            { label: "a2", key: "a2", type: "number", unit: "", required: true },
            { label: "b1", key: "b1", type: "number", unit: "", required: true },
            { label: "b2", key: "b2", type: "number", unit: "", required: true }
        ],
        expression: "(a1*b1 + a2*b2) / (sqrt(a1^2 + a2^2) * sqrt(b1^2 + b2^2))",
        output: { label: "Cosine similarity", unit: "" },
        examples: [{ a1: 1, a2: 2, b1: 2, b2: 1 }]
    },
    {
        id: "bayes_theorem",
        category: "AI/ML (Core)",
        title: "Bayes' Theorem",
        description: "P(A|B) = P(B|A)P(A)/P(B)",
        inputs: [
            { label: "P(B|A)", key: "pBgA", type: "number", unit: "", required: true },
            { label: "P(A)", key: "pA", type: "number", unit: "", required: true },
            { label: "P(B)", key: "pB", type: "number", unit: "", required: true }
        ],
        expression: "pBgA * pA / pB",
        output: { label: "P(A|B)", unit: "" },
        examples: [{ pBgA: 0.9, pA: 0.01, pB: 0.05 }]
    },

    // ============================================================
    // AI/ML (Metrics)
    // ============================================================
    {
        id: "accuracy",
        category: "AI/ML (Metrics)",
        title: "Accuracy",
        description: "(TP+TN)/(TP+TN+FP+FN)",
        inputs: [
            { label: "TP", key: "TP", type: "number", unit: "", required: true },
            { label: "TN", key: "TN", type: "number", unit: "", required: true },
            { label: "FP", key: "FP", type: "number", unit: "", required: true },
            { label: "FN", key: "FN", type: "number", unit: "", required: true }
        ],
        expression: "(TP + TN) / (TP + TN + FP + FN)",
        output: { label: "Accuracy", unit: "" },
        examples: [{ TP: 50, TN: 40, FP: 5, FN: 5 }]
    },
    {
        id: "precision",
        category: "AI/ML (Metrics)",
        title: "Precision",
        description: "TP/(TP+FP)",
        inputs: [
            { label: "TP", key: "TP", type: "number", unit: "", required: true },
            { label: "FP", key: "FP", type: "number", unit: "", required: true }
        ],
        expression: "TP / (TP + FP)",
        output: { label: "Precision", unit: "" },
        examples: [{ TP: 50, FP: 10 }]
    },
    {
        id: "recall",
        category: "AI/ML (Metrics)",
        title: "Recall",
        description: "TP/(TP+FN)",
        inputs: [
            { label: "TP", key: "TP", type: "number", unit: "", required: true },
            { label: "FN", key: "FN", type: "number", unit: "", required: true }
        ],
        expression: "TP / (TP + FN)",
        output: { label: "Recall", unit: "" },
        examples: [{ TP: 50, FN: 5 }]
    },
    {
        id: "f1_score",
        category: "AI/ML (Metrics)",
        title: "F1 Score",
        description: "2PR/(P+R)",
        inputs: [
            { label: "Precision (P)", key: "P", type: "number", unit: "", required: true },
            { label: "Recall (R)", key: "R", type: "number", unit: "", required: true }
        ],
        expression: "2 * (P * R) / (P + R)",
        output: { label: "F1", unit: "" },
        examples: [{ P: 0.83, R: 0.91 }]
    },

    // ============================================================
    // AI/ML (NLP)
    // ============================================================
    {
        id: "tf_idf",
        category: "AI/ML (NLP)",
        title: "TF-IDF",
        description: "tfidf = tf * log(N/df)",
        inputs: [
            { label: "Term frequency (tf)", key: "tf", type: "number", unit: "", required: true },
            { label: "Number of docs (N)", key: "N", type: "number", unit: "", required: true },
            { label: "Doc frequency (df)", key: "df", type: "number", unit: "", required: true }
        ],
        expression: "tf * log(N / df)",
        output: { label: "TF-IDF", unit: "" },
        examples: [{ tf: 3, N: 1000, df: 10 }]
    },
    {
        id: "perplexity_from_cross_entropy_bits",
        category: "AI/ML (NLP)",
        title: "Perplexity",
        description: "PPL = 2^H (H in bits)",
        inputs: [{ label: "Cross-entropy (H)", key: "H", type: "number", unit: "bits", required: true }],
        expression: "2^H",
        output: { label: "Perplexity (PPL)", unit: "" },
        examples: [{ H: 3 }]
    },
    // ============================================================
    // Physics (Mechanics) - Extended
    // ============================================================
    {
        id: "torque",
        category: "Physics (Mechanics)",
        title: "Torque",
        description: "tau = r F sin(theta)",
        inputs: [
            { label: "Radius (r)", key: "r", type: "number", unit: "m", required: true },
            { label: "Force (F)", key: "F", type: "number", unit: "N", required: true },
            { label: "Angle (theta)", key: "theta", type: "number", unit: "rad", required: true }
        ],
        expression: "r * F * sin(theta)",
        output: { label: "Torque (tau)", unit: "N·m" },
        examples: [{ r: 0.5, F: 10, theta: 1.5708 }]
    },
    {
        id: "rotational_kinetic_energy",
        category: "Physics (Mechanics)",
        title: "Rotational Kinetic Energy",
        description: "K = 1/2 I omega^2",
        inputs: [
            { label: "Moment of Inertia (I)", key: "I", type: "number", unit: "kg·m^2", required: true },
            { label: "Angular Velocity (omega)", key: "omega", type: "number", unit: "rad/s", required: true }
        ],
        expression: "0.5 * I * omega^2",
        output: { label: "Energy (K)", unit: "J" },
        examples: [{ I: 2, omega: 10 }]
    },

    // ============================================================
    // Physics (Waves) - Extended
    // ============================================================
    {
        id: "beat_frequency",
        category: "Physics (Waves)",
        title: "Beat Frequency",
        description: "f_beat = |f1 - f2|",
        inputs: [
            { label: "Frequency 1 (f1)", key: "f1", type: "number", unit: "Hz", required: true },
            { label: "Frequency 2 (f2)", key: "f2", type: "number", unit: "Hz", required: true }
        ],
        expression: "abs(f1 - f2)",
        output: { label: "Beat Frequency", unit: "Hz" },
        examples: [{ f1: 440, f2: 442 }]
    },

    // ============================================================
    // Mathematics (Algebra) - Extended
    // ============================================================
    {
        id: "exponential_growth",
        category: "Mathematics (Algebra)",
        title: "Exponential Growth/Decay",
        description: "N = N0 e^(rt)",
        inputs: [
            { label: "Initial value (N0)", key: "N0", type: "number", unit: "", required: true },
            { label: "Rate (r)", key: "r", type: "number", unit: "", required: true },
            { label: "Time (t)", key: "t", type: "number", unit: "", required: true }
        ],
        expression: "N0 * e^(r * t)",
        output: { label: "Final value (N)", unit: "" },
        examples: [{ N0: 100, r: 0.05, t: 10 }]
    },

    // ============================================================
    // Mathematics (Geometry) - Extended
    // ============================================================
    {
        id: "area_ellipse",
        category: "Mathematics (Geometry)",
        title: "Ellipse Area",
        description: "A = pi a b",
        inputs: [
            { label: "Semi-major axis (a)", key: "a", type: "number", unit: "", required: true },
            { label: "Semi-minor axis (b)", key: "b", type: "number", unit: "", required: true }
        ],
        expression: "pi * a * b",
        output: { label: "Area (A)", unit: "square units" },
        examples: [{ a: 5, b: 3 }]
    },
    {
        id: "surface_area_sphere",
        category: "Mathematics (Geometry)",
        title: "Sphere Surface Area",
        description: "A = 4 pi r^2",
        inputs: [{ label: "Radius (r)", key: "r", type: "number", unit: "", required: true }],
        expression: "4 * pi * r^2",
        output: { label: "Surface Area (A)", unit: "square units" },
        examples: [{ r: 3 }]
    },
    {
        id: "surface_area_cylinder",
        category: "Mathematics (Geometry)",
        title: "Cylinder Surface Area",
        description: "A = 2pi r h + 2pi r^2",
        inputs: [
            { label: "Radius (r)", key: "r", type: "number", unit: "", required: true },
            { label: "Height (h)", key: "h", type: "number", unit: "", required: true }
        ],
        expression: "2 * pi * r * h + 2 * pi * r^2",
        output: { label: "Surface Area (A)", unit: "square units" },
        examples: [{ r: 3, h: 5 }]
    },
    {
        id: "volume_cone",
        category: "Mathematics (Geometry)",
        title: "Cone Volume",
        description: "V = 1/3 pi r^2 h",
        inputs: [
            { label: "Radius (r)", key: "r", type: "number", unit: "", required: true },
            { label: "Height (h)", key: "h", type: "number", unit: "", required: true }
        ],
        expression: "(1/3) * pi * r^2 * h",
        output: { label: "Volume (V)", unit: "cubic units" },
        examples: [{ r: 3, h: 9 }]
    },

    // ============================================================
    // Mathematics (Trigonometry) - Extended
    // ============================================================
    {
        id: "arc_length",
        category: "Mathematics (Trigonometry)",
        title: "Arc Length",
        description: "s = r theta (radians)",
        inputs: [
            { label: "Radius (r)", key: "r", type: "number", unit: "", required: true },
            { label: "Angle (theta)", key: "theta", type: "number", unit: "rad", required: true }
        ],
        expression: "r * theta",
        output: { label: "Arc Length (s)", unit: "" },
        examples: [{ r: 10, theta: 1.57 }]
    },
    {
        id: "sector_area",
        category: "Mathematics (Trigonometry)",
        title: "Sector Area",
        description: "A = 1/2 r^2 theta (radians)",
        inputs: [
            { label: "Radius (r)", key: "r", type: "number", unit: "", required: true },
            { label: "Angle (theta)", key: "theta", type: "number", unit: "rad", required: true }
        ],
        expression: "0.5 * r^2 * theta",
        output: { label: "Area (A)", unit: "square units" },
        examples: [{ r: 10, theta: 1.57 }]
    },

    // ============================================================
    // Mathematics (Statistics & Probability) - Extended
    // ============================================================
    {
        id: "standard_error_mean",
        category: "Mathematics (Statistics & Probability)",
        title: "Standard Error (Mean)",
        description: "SE = sigma / sqrt(n)",
        inputs: [
            { label: "Std Dev (sigma)", key: "sigma", type: "number", unit: "", required: true },
            { label: "Sample size (n)", key: "n", type: "number", unit: "", required: true }
        ],
        expression: "sigma / sqrt(n)",
        output: { label: "Standard Error (SE)", unit: "" },
        examples: [{ sigma: 15, n: 100 }]
    },
    {
        id: "chi_square_statistic",
        category: "Mathematics (Statistics & Probability)",
        title: "Chi-Square Statistic",
        description: "chi2 = (O - E)^2 / E",
        inputs: [
            { label: "Observed (O)", key: "O", type: "number", unit: "", required: true },
            { label: "Expected (E)", key: "E", type: "number", unit: "", required: true }
        ],
        expression: "(O - E)^2 / E",
        output: { label: "Chi-square", unit: "" },
        examples: [{ O: 10, E: 8 }]
    },

    // ============================================================
    // Computer Science (Theory) - Extended
    // ============================================================
    {
        id: "littles_law",
        category: "Computer Science (Theory)",
        title: "Little's Law",
        description: "L = lambda * W",
        inputs: [
            { label: "Arrival Rate (lambda)", key: "lambda", type: "number", unit: "items/s", required: true },
            { label: "Wait Time (W)", key: "W", type: "number", unit: "s", required: true }
        ],
        expression: "lambda * W",
        output: { label: "Avg Items (L)", unit: "items" },
        examples: [{ lambda: 5, W: 2 }]
    },
    {
        id: "network_utilization",
        category: "Computer Science (Networking)",
        title: "Network Utilization",
        description: "U = Traffic / Capacity",
        inputs: [
            { label: "Traffic Load", key: "traffic", type: "number", unit: "bps", required: true },
            { label: "Link Capacity", key: "capacity", type: "number", unit: "bps", required: true }
        ],
        expression: "traffic / capacity",
        output: { label: "Utilization", unit: "ratio" },
        examples: [{ traffic: 500e6, capacity: 1e9 }]
    },

    // ============================================================
    // AI/ML (Core) - Extended
    // ============================================================
    {
        id: "activation_relu",
        category: "AI/ML (Core)",
        title: "ReLU Activation",
        description: "f(x) = max(0, x)",
        inputs: [{ label: "Input (x)", key: "x", type: "number", unit: "", required: true }],
        expression: "max(0, x)",
        output: { label: "Activation", unit: "" },
        examples: [{ x: -5 }]
    },
    {
        id: "activation_leaky_relu",
        category: "AI/ML (Core)",
        title: "Leaky ReLU",
        description: "f(x) = max(alpha*x, x)",
        inputs: [
            { label: "Input (x)", key: "x", type: "number", unit: "", required: true },
            { label: "Alpha", key: "alpha", type: "number", unit: "", required: true }
        ],
        expression: "max(alpha * x, x)",
        output: { label: "Activation", unit: "" },
        examples: [{ x: -5, alpha: 0.01 }]
    },
    {
        id: "activation_tanh",
        category: "AI/ML (Core)",
        title: "Tanh Activation",
        description: "tanh(x) = (e^x - e^-x)/(e^x + e^-x)",
        inputs: [{ label: "Input (x)", key: "x", type: "number", unit: "", required: true }],
        expression: "(e^x - e^-x) / (e^x + e^-x)",
        output: { label: "Activation", unit: "" },
        examples: [{ x: 1 }]
    },
    {
        id: "elastic_net_penalty",
        category: "AI/ML (Core)",
        title: "Elastic Net Penalty",
        description: "P = lambda1|w| + lambda2 w^2",
        inputs: [
            { label: "Weight (w)", key: "w", type: "number", unit: "", required: true },
            { label: "L1 Coeff (lambda1)", key: "lambda1", type: "number", unit: "", required: true },
            { label: "L2 Coeff (lambda2)", key: "lambda2", type: "number", unit: "", required: true }
        ],
        expression: "lambda1 * abs(w) + lambda2 * w^2",
        output: { label: "Penalty", unit: "" },
        examples: [{ w: 2, lambda1: 0.1, lambda2: 0.05 }]
    },
    // ============================================================
    // University Physics (Fluid Dynamics)
    // ============================================================
    {
        id: "bernoullis_equation_p",
        category: "University Physics (Fluid Dynamics)",
        title: "Bernoulli's Eq (P1)",
        description: "P1 = P2 + 0.5rho(v2^2-v1^2) + rhog(h2-h1)",
        inputs: [
            { label: "Pressure P2", key: "P2", type: "number", unit: "Pa", required: true },
            { label: "Density rho", key: "rho", type: "number", unit: "kg/m^3", required: true },
            { label: "Velocity v1", key: "v1", type: "number", unit: "m/s", required: true },
            { label: "Velocity v2", key: "v2", type: "number", unit: "m/s", required: true },
            { label: "Height h1", key: "h1", type: "number", unit: "m", required: true },
            { label: "Height h2", key: "h2", type: "number", unit: "m", required: true },
            { label: "Gravity g", key: "g", type: "number", unit: "m/s^2", required: true }
        ],
        expression: "P2 + 0.5 * rho * (v2^2 - v1^2) + rho * g * (h2 - h1)",
        output: { label: "Pressure P1", unit: "Pa" },
        examples: [{ P2: 101325, rho: 1000, v1: 2, v2: 5, h1: 0, h2: 1, g: 9.81 }]
    },
    {
        id: "poiseuilles_law",
        category: "University Physics (Fluid Dynamics)",
        title: "Poiseuille's Law",
        description: "Q = (pi r^4 dP) / (8 eta L)",
        inputs: [
            { label: "Radius r", key: "r", type: "number", unit: "m", required: true },
            { label: "Press. Diff dP", key: "dP", type: "number", unit: "Pa", required: true },
            { label: "Viscosity eta", key: "eta", type: "number", unit: "Pa·s", required: true },
            { label: "Length L", key: "L", type: "number", unit: "m", required: true }
        ],
        expression: "(pi * r^4 * dP) / (8 * eta * L)",
        output: { label: "Flow Rate Q", unit: "m^3/s" },
        examples: [{ r: 0.01, dP: 100, eta: 0.001, L: 2 }]
    },
    {
        id: "reynolds_number",
        category: "University Physics (Fluid Dynamics)",
        title: "Reynolds Number",
        description: "Re = (rho v D) / eta",
        inputs: [
            { label: "Density rho", key: "rho", type: "number", unit: "kg/m^3", required: true },
            { label: "Velocity v", key: "v", type: "number", unit: "m/s", required: true },
            { label: "Diameter D", key: "D", type: "number", unit: "m", required: true },
            { label: "Viscosity eta", key: "eta", type: "number", unit: "Pa·s", required: true }
        ],
        expression: "(rho * v * D) / eta",
        output: { label: "Reynolds Num", unit: "" },
        examples: [{ rho: 1000, v: 2, D: 0.1, eta: 0.001 }]
    },

    // ============================================================
    // University Mathemetics (Calculus II)
    // ============================================================
    {
        id: "taylor_series_2nd_order",
        category: "University Math (Calculus II)",
        title: "Taylor Approx (2nd Order)",
        description: "f(x) ≈ f(a) + f'(a)(x-a) + f''(a)/2(x-a)^2",
        inputs: [
            { label: "f(a)", key: "fa", type: "number", unit: "", required: true },
            { label: "f'(a)", key: "fpa", type: "number", unit: "", required: true },
            { label: "f''(a)", key: "fppa", type: "number", unit: "", required: true },
            { label: "x", key: "x", type: "number", unit: "", required: true },
            { label: "a", key: "a", type: "number", unit: "", required: true }
        ],
        expression: "fa + fpa * (x - a) + (fppa / 2) * (x - a)^2",
        output: { label: "f(x) approx", unit: "" },
        examples: [{ fa: 1, fpa: 1, fppa: 1, x: 0.1, a: 0 }]
    },
    {
        id: "simpsons_rule",
        category: "University Math (Calculus II)",
        title: "Simpson's Rule (1 step)",
        description: "I ≈ (b-a)/6 * (f(a) + 4f(m) + f(b))",
        inputs: [
            { label: "Start a", key: "a", type: "number", unit: "", required: true },
            { label: "End b", key: "b", type: "number", unit: "", required: true },
            { label: "f(a)", key: "fa", type: "number", unit: "", required: true },
            { label: "f((a+b)/2)", key: "fm", type: "number", unit: "", required: true },
            { label: "f(b)", key: "fb", type: "number", unit: "", required: true }
        ],
        expression: "((b - a) / 6) * (fa + 4 * fm + fb)",
        output: { label: "Integral", unit: "" },
        examples: [{ a: 0, b: 2, fa: 0, fm: 1, fb: 4 }]
    },

    // ============================================================
    // University Math (Linear Algebra)
    // ============================================================
    {
        id: "eigenvalue_2x2_char_eq",
        category: "University Math (Linear Algebra)",
        title: "Eigenvalues (2x2) Trace/Det",
        description: "lambda^2 - tr(A)lambda + det(A) = 0",
        inputs: [
            { label: "Tr(A)", key: "tr", type: "number", unit: "", required: true },
            { label: "Det(A)", key: "det", type: "number", unit: "", required: true }
        ],
        expression: "(tr + sqrt(tr^2 - 4*det)) / 2",
        output: { label: "Lambda 1", unit: "" },
        examples: [{ tr: 5, det: 6 }]
    },
    {
        id: "vector_projection",
        category: "University Math (Linear Algebra)",
        title: "Vector Projection (a on b)",
        description: "Proj = (a.b / |b|^2) * b (returns mag coeff)",
        inputs: [
            { label: "a1", key: "a1", type: "number", unit: "", required: true },
            { label: "a2", key: "a2", type: "number", unit: "", required: true },
            { label: "b1", key: "b1", type: "number", unit: "", required: true },
            { label: "b2", key: "b2", type: "number", unit: "", required: true }
        ],
        expression: "(a1*b1 + a2*b2) / (b1^2 + b2^2)",
        output: { label: "Coeff c in c*b", unit: "" },
        examples: [{ a1: 1, a2: 2, b1: 3, b2: 4 }]
    },

    // ============================================================
    // University Physics (Electromagnetism)
    // ============================================================
    {
        id: "coulomb_force_vector_mag",
        category: "University Physics (Electromagnetism)",
        title: "Coulomb Force 3D (Mag)",
        description: "F = k q1 q2 / |r|^2",
        inputs: [
            { label: "q1", key: "q1", type: "number", unit: "C", required: true },
            { label: "q2", key: "q2", type: "number", unit: "C", required: true },
            { label: "rx", key: "rx", type: "number", unit: "m", required: true },
            { label: "ry", key: "ry", type: "number", unit: "m", required: true },
            { label: "rz", key: "rz", type: "number", unit: "m", required: true }
        ],
        expression: "(8.987e9 * abs(q1 * q2)) / (rx^2 + ry^2 + rz^2)",
        output: { label: "|F|", unit: "N" },
        examples: [{ q1: 1e-6, q2: -1e-6, rx: 0.1, ry: 0.1, rz: 0 }]
    },
    {
        id: "magnetic_flux",
        category: "University Physics (Electromagnetism)",
        title: "Magnetic Flux",
        description: "Phi = B A cos(theta)",
        inputs: [
            { label: "B field", key: "B", type: "number", unit: "T", required: true },
            { label: "Area A", key: "A", type: "number", unit: "m^2", required: true },
            { label: "Angle theta", key: "theta", type: "number", unit: "rad", required: true }
        ],
        expression: "B * A * cos(theta)",
        output: { label: "Flux", unit: "Wb" },
        examples: [{ B: 0.5, A: 0.1, theta: 0 }]
    }
];

export default formulas;
export { formulas };