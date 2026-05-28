-- Permite que usuários autenticados atualizem o status de ativos cripto.
-- Necessário para a página /cripto/configuracoes.

drop policy if exists "Todos autenticados podem atualizar ativos cripto" on public.cripto_ativos;

create policy "Todos autenticados podem atualizar ativos cripto"
on public.cripto_ativos
for update
to authenticated
using (true)
with check (true);