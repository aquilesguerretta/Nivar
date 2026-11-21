export type AuthoringValueType = "text" | "number" | "boolean";

export interface AuthoringField {
  id: string;
  key: string;
  type: AuthoringValueType;
  value: string;
}

export class AuthoringValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthoringValidationError";
  }
}

let fieldSequence = 0;

export function blankAuthoringField(): AuthoringField {
  fieldSequence += 1;
  return {
    id: `field-${fieldSequence}`,
    key: "",
    type: "text",
    value: "",
  };
}

function valueType(value: unknown): AuthoringValueType | null {
  if (typeof value === "string") return "text";
  if (typeof value === "number" && Number.isFinite(value)) return "number";
  if (typeof value === "boolean") return "boolean";
  return null;
}

export function payloadToAuthoringFields(
  payload: Record<string, unknown>,
): AuthoringField[] {
  const entries = Object.entries(payload);
  if (entries.length === 0) return [blankAuthoringField()];

  return entries.map(([key, value]) => {
    const type = valueType(value);
    if (!type) {
      throw new AuthoringValidationError(
        `O campo “${key}” não usa um valor primitivo compatível com este editor.`,
      );
    }
    return {
      ...blankAuthoringField(),
      key,
      type,
      value: typeof value === "boolean" ? String(value) : String(value),
    };
  });
}

export function authoringFieldsToPayload(
  fields: AuthoringField[],
): Record<string, string | number | boolean> {
  if (fields.length === 0) {
    throw new AuthoringValidationError("Adicione pelo menos um campo.");
  }

  const payload: Record<string, string | number | boolean> = {};
  for (const field of fields) {
    const key = field.key.trim();
    if (!key) throw new AuthoringValidationError("Todo campo precisa de um nome.");
    if (Object.hasOwn(payload, key)) {
      throw new AuthoringValidationError(`O campo “${key}” está repetido.`);
    }

    if (field.type === "number") {
      if (!field.value.trim()) {
        throw new AuthoringValidationError(`Informe um número para “${key}”.`);
      }
      const numberValue = Number(field.value);
      if (!Number.isFinite(numberValue)) {
        throw new AuthoringValidationError(`“${field.value}” não é um número válido para “${key}”.`);
      }
      payload[key] = numberValue;
    } else if (field.type === "boolean") {
      if (field.value !== "true" && field.value !== "false") {
        throw new AuthoringValidationError(`Escolha sim ou não para “${key}”.`);
      }
      payload[key] = field.value === "true";
    } else {
      if (!field.value.trim()) {
        throw new AuthoringValidationError(`Informe um valor para “${key}”.`);
      }
      payload[key] = field.value;
    }
  }
  return payload;
}

export function valueSchemaFromAuthoringFields(
  fields: AuthoringField[],
): Record<string, { type: AuthoringValueType }> {
  const payload = authoringFieldsToPayload(fields);
  return Object.fromEntries(
    Object.keys(payload).map((key) => {
      const field = fields.find((candidate) => candidate.key.trim() === key)!;
      return [key, { type: field.type }];
    }),
  );
}

export function formatAuthoringValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (typeof value === "number" || typeof value === "string") return String(value);
  return "Valor estruturado não editável nesta fase";
}
