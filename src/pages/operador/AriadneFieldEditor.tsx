import { Plus, X } from "lucide-react";

import {
  blankAuthoringField,
  type AuthoringField,
  type AuthoringValueType,
} from "../../lib/ariadne/authoring";

export function TechnicalId({ value }: { value: string }) {
  return (
    <details className="ariadne-authoring__technical">
      <summary>Ver identificador técnico</summary>
      <code>{value}</code>
    </details>
  );
}

export function FieldEditor({
  allowEmpty = false,
  disabled,
  fields,
  legend,
  onChange,
}: {
  allowEmpty?: boolean;
  disabled: boolean;
  fields: AuthoringField[];
  legend: string;
  onChange: (fields: AuthoringField[]) => void;
}) {
  const update = (id: string, patch: Partial<AuthoringField>) => {
    onChange(fields.map((field) => field.id === id ? { ...field, ...patch } : field));
  };
  return (
    <fieldset className="ariadne-fields" disabled={disabled}>
      <legend>{legend}</legend>
      {allowEmpty && fields.length === 0 && (
        <p className="ariadne-fields__empty">Nenhuma alteração hipotética.</p>
      )}
      {fields.map((field, index) => (
        <div className="ariadne-fields__row" key={field.id}>
          <label>
            <span>Campo {index + 1}</span>
            <input
              aria-label={`Nome do campo ${index + 1}`}
              placeholder="ex.: capacidade"
              value={field.key}
              onChange={(event) => update(field.id, { key: event.target.value })}
            />
          </label>
          <label>
            <span>Tipo</span>
            <select
              aria-label={`Tipo do campo ${index + 1}`}
              value={field.type}
              onChange={(event) => {
                const type = event.target.value as AuthoringValueType;
                update(field.id, { type, value: type === "boolean" ? "true" : "" });
              }}
            >
              <option value="text">Texto</option>
              <option value="number">Número</option>
              <option value="boolean">Sim / não</option>
            </select>
          </label>
          <label>
            <span>Valor</span>
            {field.type === "boolean" ? (
              <select
                aria-label={`Valor do campo ${index + 1}`}
                value={field.value || "true"}
                onChange={(event) => update(field.id, { value: event.target.value })}
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            ) : (
              <input
                aria-label={`Valor do campo ${index + 1}`}
                inputMode={field.type === "number" ? "decimal" : undefined}
                placeholder={field.type === "number" ? "ex.: 420" : "valor observado"}
                value={field.value}
                onChange={(event) => update(field.id, { value: event.target.value })}
              />
            )}
          </label>
          <button
            type="button"
            aria-label={`Remover campo ${index + 1}`}
            className="ariadne-fields__remove"
            disabled={!allowEmpty && fields.length === 1}
            onClick={() => onChange(fields.filter((candidate) => candidate.id !== field.id))}
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="ariadne-fields__add"
        onClick={() => onChange([...fields, blankAuthoringField()])}
      >
        <Plus size={13} /> Adicionar campo
      </button>
      <p className="ariadne-fields__note">
        Valores e tipos são preservados de forma explícita. Unidades de medida não são inferidas nesta fase.
      </p>
    </fieldset>
  );
}
