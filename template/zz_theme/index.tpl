{if $smarty.session.is_mobile}
	{include file="{$_lang.moban}/library/m_header.lbi"}
	{include file="{$_lang.moban}/index/{$module}.lbi"}
{else}
	{include file="{$_lang.moban}/library/pc_header.lbi"}
	{include file="{$_lang.moban}/index/{$module==("index")?"m_index":$module}.lbi"}
	{include file="{$_lang.moban}/library/footer.lbi"}
{/if}
