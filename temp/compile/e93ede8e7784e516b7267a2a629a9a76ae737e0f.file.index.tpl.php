<?php /* Smarty version Smarty-3.1.7, created on 2018-01-04 11:18:44
         compiled from "J:/www/Flypie/template\default\index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:72925a4d9d14cc37d1-47018289%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'e93ede8e7784e516b7267a2a629a9a76ae737e0f' => 
    array (
      0 => 'J:/www/Flypie/template\\default\\index.tpl',
      1 => 1515031351,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '72925a4d9d14cc37d1-47018289',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    '_lang' => 0,
    'module' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_5a4d9d14cebe7',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5a4d9d14cebe7')) {function content_5a4d9d14cebe7($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate (($_smarty_tpl->tpl_vars['_lang']->value['moban'])."/library/header.lbi", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<?php echo $_smarty_tpl->getSubTemplate (($_smarty_tpl->tpl_vars['_lang']->value['moban'])."/index/".($_smarty_tpl->tpl_vars['module']->value).".lbi", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>


<?php echo $_smarty_tpl->getSubTemplate (($_smarty_tpl->tpl_vars['_lang']->value['moban'])."/library/footer.lbi", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

<?php }} ?>