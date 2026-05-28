-- Permite que usuarios autenticados excluam apenas as proprias transacoes.
-- Necessario para a pagina /cripto/transacoes.

drop policy if exists "Usuarios podem excluir suas transacoes cripto" on public.cripto_transacoes;

create policy "Usuarios podem excluir suas transacoes cripto"
on public.cripto_transacoes
for delete
to authenticated
using (auth.uid() = user_id);