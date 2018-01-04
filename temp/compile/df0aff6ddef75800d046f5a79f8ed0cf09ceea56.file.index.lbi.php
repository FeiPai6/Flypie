<?php /* Smarty version Smarty-3.1.7, created on 2018-01-04 11:18:44
         compiled from "J:/www/Flypie/template\default\index\index.lbi" */ ?>
<?php /*%%SmartyHeaderCode:182545a4d9d14e41ed8-30204502%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'df0aff6ddef75800d046f5a79f8ed0cf09ceea56' => 
    array (
      0 => 'J:/www/Flypie/template\\default\\index\\index.lbi',
      1 => 1515031351,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '182545a4d9d14e41ed8-30204502',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'i' => 0,
    'recommend' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.7',
  'unifunc' => 'content_5a4d9d14e7122',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5a4d9d14e7122')) {function content_5a4d9d14e7122($_smarty_tpl) {?><style>
	body{
		background-color: #efefef;
	}
	.inline.hidden-xs {
  		display: inline !important;
  	}
	.chosen_wrap{
	}
	.img_list{
		margin-bottom: 10px;
		cursor: pointer;
	}
	.title_cover{
		height: 30px;
		background-color: rgba(138,137,137,0.5);
		position: absolute;
		bottom: 0px;
		width: 100%;
		color: #fff;
		line-height: 30px;
		font-size: 14px;
		padding-left: 10px;
	}
	.more{
		margin-top: 10px;
		text-align: right;
		display: block;
	}
	.of_hide{
		display: block;
	    overflow: hidden;
	    text-overflow: ellipsis;
	}
	.padding0{
		padding: 0;
	}
	.cards .card .card-content span{
		width: 100%;
		height: 20px;
	}
	.content_nav{
		/*margin-top: 18px;*/
	}
	.content_nav .col-md-2 div{
		height: 60px;
		line-height: 60px;
		text-align: center;
		font-size: 23px;
		border-radius: 8px;
		cursor: pointer;
		color:#fff;
	}
	.content_nav .col-xs-4{
		margin-top: 10px;
	}
	.kf_block{
		background-color: #EA644A;
	}
	.gj_block{
		background-color: #F1A325;
	}
	.ly_block{
		background-color: #38B03F;
	}
	.jz_block{
		background-color: #03B8CF;
	}
	.jy_block{
		background-color: #BD7B46;
	}
	.xw_block{
		background-color: #8666B8;
	}
</style>
<script>
	$(function(){
		$("#top_frame").load(function() {
			console.log($(this).contents().find("body").height());
			$(this).height($(window).height()*0.7);
		})
	})
</script>
<div class="container">
	
	<div class="row">
		<div class="col-md-3">
			<h2 class="text-muted">精选全景<small style="margin-left:10px;">优质的全景作品赏析</small></h2>
		</div>
	</div>
	<div class="row chosen_wrap">
		<div class="col-md-5" style="height:380px;">
			<div id="myNiceCarousel" class="carousel slide" data-ride="carousel">
			  <!-- 轮播项目 -->
			  <div class="carousel-inner">
			   <?php  $_smarty_tpl->tpl_vars['i'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['i']->value = 0;
  if ($_smarty_tpl->tpl_vars['i']->value<3){ for ($_foo=true;$_smarty_tpl->tpl_vars['i']->value<3; $_smarty_tpl->tpl_vars['i']->value++){
?>
			    <div class="item <?php if ($_smarty_tpl->tpl_vars['i']->value==0){?>active<?php }?>">
			      <a target="_blank" href="/tour/<?php echo $_smarty_tpl->tpl_vars['recommend']->value[$_smarty_tpl->tpl_vars['i']->value]['view_uuid'];?>
">
				   <img src="<?php echo $_smarty_tpl->tpl_vars['recommend']->value[$_smarty_tpl->tpl_vars['i']->value]['thumb_path'];?>
"  class="img-responsive" style="width: 100%;max-height: 420px;">
			      </a>
				  <div class="carousel-caption">
			        <h3><?php echo $_smarty_tpl->tpl_vars['recommend']->value[$_smarty_tpl->tpl_vars['i']->value]['name'];?>
</h3>
			      </div>
			    </div>
			   <?php }} ?>    
			  </div>
			  <!-- 项目切换按钮 -->
			   <a class="left carousel-control" href="#myNiceCarousel" data-slide="prev">
			     <span class="icon icon-chevron-left"></span>
			   </a>
			   <a class="right carousel-control" href="#myNiceCarousel" data-slide="next">
			     <span class="icon icon-chevron-right"></span>
			   </a>
			</div>
		</div>

		<div class="col-md-7">
			<div class="row chosen_wrap">
			    <?php  $_smarty_tpl->tpl_vars['i'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['i']->value = 3;
  if ($_smarty_tpl->tpl_vars['i']->value<9){ for ($_foo=true;$_smarty_tpl->tpl_vars['i']->value<9; $_smarty_tpl->tpl_vars['i']->value++){
?>
				<div class="col-md-4 col-sm-4 col-xs-6 img_list">
					<a href="/tour/<?php echo $_smarty_tpl->tpl_vars['recommend']->value[$_smarty_tpl->tpl_vars['i']->value]['view_uuid'];?>
" target="_blank">
						<img src="<?php echo $_smarty_tpl->tpl_vars['recommend']->value[$_smarty_tpl->tpl_vars['i']->value]['thumb_path'];?>
" class="img-responsive">
					</a>
					<div style="position:relative">
						<div class="title_cover of_hide"><?php echo $_smarty_tpl->tpl_vars['recommend']->value[$_smarty_tpl->tpl_vars['i']->value]['name'];?>
</div>
					</div>
				</div>
			    <?php }} ?>    
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-xs-12">
			<h2 class="text-muted">推荐全景<small style="margin-left:10px;">为您推荐的优质作品</small><a href="/pictures"><small class="text-muted  pull-right more">更多>></small></a></h2>
		</div>
	</div>
	<!--一个卡片列表行-->
	<div class="row">
		<div class="cards" style="margin:0;">
			<!--卡片列表循环-->
			<?php  $_smarty_tpl->tpl_vars['i'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['i']->value = 8;
  if ($_smarty_tpl->tpl_vars['i']->value<20){ for ($_foo=true;$_smarty_tpl->tpl_vars['i']->value<20; $_smarty_tpl->tpl_vars['i']->value++){
?>
			<div class="col-md-3 col-sm-3 col-xs-6 col-lg-3">
			   <div class="card" href="###">
			     <a target="_blank" href="/tour/<?php echo $_smarty_tpl->tpl_vars['recommend']->value[$_smarty_tpl->tpl_vars['i']->value]['view_uuid'];?>
"><img src="<?php echo $_smarty_tpl->tpl_vars['recommend']->value[$_smarty_tpl->tpl_vars['i']->value]['thumb_path'];?>
" alt="<?php echo $_smarty_tpl->tpl_vars['recommend']->value[$_smarty_tpl->tpl_vars['i']->value]['name'];?>
"></a>
			     <div class="card-heading">
			     	<div class="col-md-9 col-xs-8 of_hide padding0">
			     		<strong class="text-primary"><?php echo $_smarty_tpl->tpl_vars['recommend']->value[$_smarty_tpl->tpl_vars['i']->value]['name'];?>
</strong> 
			     	</div>
			     	<div class="col-md-3 col-xs-4 of_hide padding0">
			     		<div class="pull-right text-danger"><i class="icon-heart-empty"></i> <?php echo $_smarty_tpl->tpl_vars['recommend']->value[$_smarty_tpl->tpl_vars['i']->value]['browsing_num'];?>
</div>
			     	</div>
			     </div>
			     <div class="card-content text-muted">
			     <span class="of_hide"><?php echo $_smarty_tpl->tpl_vars['recommend']->value[$_smarty_tpl->tpl_vars['i']->value]['profile'];?>
</span>
			     </div>
			   </div>
			 </div>
			<?php }} ?>	         
			<!--卡片列表循环结束-->	
		</div>
	</div>
	<!--一个卡片列表行结束-->
</div><?php }} ?>