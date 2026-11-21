import React from 'react';
import { Input } from './Input.jsx';
import { Button } from '../actions/Button.jsx';

const COPIA = {
  entrar: {
    titulo: 'Acesso à leitura',
    lede: 'A conta abre as séries, as notas técnicas e o histórico de apuração.',
    acao: 'Entrar',
    troca: 'Não tem acesso?',
    trocaAcao: 'Cadastrar',
  },
  cadastrar: {
    titulo: 'Cadastro',
    lede: 'O cadastro abre o acesso à leitura. Não gera contato comercial e não anexa proposta.',
    acao: 'Criar acesso',
    troca: 'Já tem acesso?',
    trocaAcao: 'Entrar',
  },
};

export function AuthForm({
  modo = 'entrar',
  onModo,
  onSubmit,
  erro,
  registro = 'NIVAR não vende energia, não intermedia contrato e não recebe comissão. O cadastro não gera contato comercial.',
  className = '',
}) {
  const c = COPIA[modo] || COPIA.entrar;
  const cadastro = modo === 'cadastrar';

  return (
    <form
      className={['nv-acesso', className].filter(Boolean).join(' ')}
      onSubmit={(e) => { e.preventDefault(); if (onSubmit) onSubmit(modo); }}
    >
      <div className="nv-acesso__cab">
        <span className="nv-acesso__eyebrow">Acesso</span>
        <h2 className="nv-acesso__titulo">{c.titulo}</h2>
        <p className="nv-acesso__lede">{c.lede}</p>
      </div>
      <div className="nv-acesso__campos">
        {cadastro ? <Input id="ac-nome" label="Nome" autoComplete="name" /> : null}
        {cadastro ? <Input id="ac-empresa" label="Empresa" autoComplete="organization" /> : null}
        <Input
          id="ac-email"
          label="E-mail corporativo"
          type="email"
          autoComplete="email"
          error={erro}
          hint={cadastro ? 'O acesso é vinculado ao domínio da empresa.' : undefined}
        />
        <Input
          id="ac-senha"
          label="Senha"
          type="password"
          autoComplete={cadastro ? 'new-password' : 'current-password'}
          hint={cadastro ? 'Mínimo de 12 caracteres.' : undefined}
        />
      </div>
      <div className="nv-acesso__acao">
        <Button variant="primario" type="submit">{c.acao}</Button>
        {!cadastro ? (
          <a className="nv-acesso__esqueci" href="#recuperar">Recuperar senha</a>
        ) : null}
      </div>
      <p className="nv-acesso__troca">
        {c.troca}{' '}
        <button
          type="button"
          className="nv-acesso__troca-b"
          onClick={() => onModo && onModo(cadastro ? 'entrar' : 'cadastrar')}
        >{c.trocaAcao}</button>
      </p>
      {registro ? <p className="nv-acesso__registro">{registro}</p> : null}
    </form>
  );
}
