export type LunarContactTimes = {
    p1?: Date
    u1?: Date
    u2?: Date
    max?: Date
    u3?: Date
    u4?: Date
    p4?: Date
}

export type LunarContacts = LunarContactTimes & {
    umbralMagnitude?: number
    penumbralMagnitude?: number
    visibility?: Record<string, boolean>
}