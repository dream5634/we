<?php
global $property_status;
global $submission_page_fields;
?>

<?php if ( is_array($submission_page_fields) && in_array('property_status', $submission_page_fields) ) { ?>    
    <div class="col-md-12 add-estate profile-page profile-onprofile row"> 
        <div class="submit_container">     

            <div class="col-md-4 profile_label">
                <!--<div class="submit_container_header"><?php esc_html_e('Select Property Status','wpestate');?></div> -->
                <div class="user_details_row"><?php esc_html_e('Select Property Status','wpestate');?></div> 
                <div class="user_profile_explain"><?php esc_html_e('Highlight your property.','wpestate')?></div>
            </div>

            <div class="col-md-4">
                <p class="col-md-12">
                    <label for="property_status"><?php esc_html_e('Property Status','wpestate');?></label>
                    <select id="property_status" name="property_status" class="select-submit">
                        <option value="normal"><?php esc_html_e('normal','wpestate');?></option>
                        <?php print trim($property_status); ?>
                    </select>
               </p>
           </div>
            
            
        </div>
    </div>
<?php }?>