<?php
// Template Name: Idx Page
// Wp Estate Pack
get_header();
$wpestate_options=wpestate_page_details($post->ID);
?>

<div class="row">
    <?php get_template_part('templates/breadcrumbs'); ?>
    <div class=" <?php print esc_html($wpestate_options['content_class']);?> ">
        <?php get_template_part('templates/ajax_container'); ?>
        <?php 
        while ( have_posts() ) : the_post();
        if (esc_html( get_post_meta($post->ID, 'post_show_title', true) ) != 'no') { ?> 
            <h1 class="entry-title single-title" ><?php the_title(); ?></h1>
        <?php 
        } 
        
        ?>
            
        <div class="meta-info"> 
            <?php esc_html_e('Posted by ', 'wpestate'); print ' '.get_the_author().' ';esc_html_e('on', 'wpestate'); print' '.the_date('', '', '', FALSE); ?>
            <?php print ' | <i class="fa fa-file-o"></i> '; the_category(', ')?>
            <?php print ' | <i class="fa fa-comment-o"></i> '; comments_number( '0', '1' );  ?>      
        </div> 


        <div class="single-content omgidx">
            <?php 
            global $more;
            $more=0;
            get_template_part('templates/postslider');   
            the_content('Continue Reading');                     
            $args = array(
                       'before'           => '<p>' . esc_html__('Pages:','wpestate'),
                       'after'            => '</p>',
                       'link_before'      => '',
                       'link_after'       => '',
                       'next_or_number'   => 'number',
                       'nextpagelink'     => esc_html__('Next page','wpestate'),
                       'previouspagelink' => esc_html__('Previous page','wpestate'),
                       'pagelink'         => '%',
                       'echo'             => 1
              ); 
            wp_link_pages( $args ); 
            ?>                           
        </div>    
         
        <!-- #related posts start-->    
        <?php  get_template_part('templates/related_posts');?>    
        <!-- #end related posts -->   
        
        <!-- #comments start-->
        <?php comments_template('', true);?> 	
        <!-- end comments -->   
        
        <?php endwhile; // end of the loop. ?>
    </div>
       
<?php  include(get_theme_file_path('sidebar.php'));  ?>
</div>   
<div class="hidden-idx">
    <?php
    $instance=array('title'=>'title','listingsToShow'=>50,'sort'=>'DateAdded|DESC','defaultDisplay'=>'listed','querySource'=>'city');
    the_widget ('dsSearchAgent_ListingsWidget',$instance);
    ?>
</div>
<?php get_footer(); ?>