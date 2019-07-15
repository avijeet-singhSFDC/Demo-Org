({
    
    doInit : function(component, event, helper) {
    	var i = 0;
        var i2 = 0;
        /*while(i2<3){
            
            i2++;
            var lead_ID = component.get("v.lead" + i2 + "_id");
            
            if(lead_ID != "lead email here"){
                var action = component.get("c.getHomeLeadStuff");
                var adjuster = i2 - 1;
                component.set("v.class_cus"+i2, "visible");
                action.setParams({
                    "emailis": component.get("v.lead" + i2 + "_id")
                });  
             
                // Register the callback function
                action.setCallback(this, function(response) {
                    i++;
                    var data = response.getReturnValue();
                    if(data == null){
                        //alert("null " + i);
                        var numistring = i - 1;
                        //document.getElementById(numistring).style.display = 'none';
                        component.set("v.class_cus"+numistring, "invisible");
                    }
                    else{
                        var all_data = data.split('#*#');
                        var numistring = i - 1;
                        //document.getElementById(numistring).style.display = 'block';
                        component.set("v.class_cus"+numistring, "visible");                      
                        component.set("v.lead" + i + "_ar[0]", all_data[0]);
                        component.set("v.lead" + i + "_ar[1]", all_data[1]);
                        component.set("v.lead" + i + "_ar[2]", all_data[2]);
                        component.set("v.lead" + i + "_ar[3]", all_data[3]);
                        component.set("v.lead" + i + "_ar[4]", all_data[4]);
                        component.set("v.lead" + i + "_ar[26]", all_data[26]);
                        if(all_data[4] == "92"){
                            component.set("v.lead" + i + "_ar[5]", "https://www.dropbox.com/s/cd797eil9zeaap9/leadScoreComponent.gif?raw=1");
                            component.set("v.lead" + i + "_ar[6]", "https://www.dropbox.com/s/remtdhuoeeljfoj/ls92.png?raw=1");
                        }
                        else if(all_data[4] == "85"){
                            component.set("v.lead" + i + "_ar[5]", "https://www.dropbox.com/s/7nd6dsnhrl23n3x/lscore85.gif?raw=1");
                            component.set("v.lead" + i + "_ar[6]", "https://www.dropbox.com/s/ewys7eek5a7v3zt/ls85.png?raw=1");
                        }
                        else if(all_data[4] == "70"){
                            component.set("v.lead" + i + "_ar[5]", "https://www.dropbox.com/s/5640arosaaaut73/lscore70.gif?raw=1");
                            component.set("v.lead" + i + "_ar[6]", "https://www.dropbox.com/s/0b1p0pk6v0rn1f0/ls70.png?raw=1");
                        }
                        else if(all_data[4] == "55"){
                            component.set("v.lead" + i + "_ar[5]", "https://www.dropbox.com/s/z82id30mjbgl0hy/lscore55.gif?raw=1");
                            component.set("v.lead" + i + "_ar[6]", "https://www.dropbox.com/s/8i3f4tiyj19e7fn/ls55.png?raw=1");
                        }
                        else{
                            component.set("v.lead" + i + "_ar[5]", "https://www.dropbox.com/s/z82id30mjbgl0hy/lscore55.gif?raw=1");
                            component.set("v.lead" + i + "_ar[6]", "https://www.dropbox.com/s/8i3f4tiyj19e7fn/ls55.png?raw=1");
                            component.set("v.lead" + i + "_ar[4]", "55");
                        }
                        
                        if(all_data[20] == "false"){
                                //I1-5
                                component.set("v.lead" + i + "_ar[7]", "https://www.dropbox.com/s/buq92zivq2xlt84/2green.png?raw=1");
                                component.set("v.lead" + i + "_ar[8]", "https://www.dropbox.com/s/buq92zivq2xlt84/2green.png?raw=1");
                                component.set("v.lead" + i + "_ar[9]", "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
                                component.set("v.lead" + i + "_ar[10]", "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
                                component.set("v.lead" + i + "_ar[11]", "https://www.dropbox.com/s/904nmmscy4h7v3a/1red.png?raw=1");
                                //t1 tr, t2 tr, etc.
                                component.set("v.lead" + i + "_ar[12]", "Phone Number is");
                                component.set("v.lead" + i + "_ar[13]", "Valid");
                                component.set("v.lead" + i + "_ar[14]", "Title is");
                                component.set("v.lead" + i + "_ar[15]", all_data[1]);
                                component.set("v.lead" + i + "_ar[16]", "Downloaded");
                                component.set("v.lead" + i + "_ar[17]", "White Paper");
                                component.set("v.lead" + i + "_ar[18]", "Interest in");
                                component.set("v.lead" + i + "_ar[19]", "Cloud Management Services");
                                component.set("v.lead" + i + "_ar[20]", "Incomplete");
                                component.set("v.lead" + i + "_ar[21]", "Free Trial Form");
                        
                        
                        }
                        else{
                            if(all_data[5] == "true"){
                                switch(all_data[21]){
                                    case '1':
                                        component.set("v.lead" + i + "_ar[7]",  "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
                                        break;
                                    case '2':
                                        component.set("v.lead" + i + "_ar[7]", "https://www.dropbox.com/s/buq92zivq2xlt84/2green.png?raw=1");
                                        break;
                                    case '3':
                                        component.set("v.lead" + i + "_ar[7]",  "https://www.dropbox.com/s/09oio24x1wnc1gf/3green2.png?raw=1");
                                        break;
                                    default:
                                        component.set("v.lead" + i + "_ar[7]",  "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
                                        break;
                                }
                            }
                            else{
                                switch(all_data[21]){
                                    case '1':
                                        component.set("v.lead" + i + "_ar[7]",  "https://www.dropbox.com/s/904nmmscy4h7v3a/1red.png?raw=1");
                                        break;
                                    case '2':
                                        component.set("v.lead" + i + "_ar[7]",  "https://www.dropbox.com/s/iafko1p48eb7skc/2red.png?raw=1");
                                        break;
                                    case '3':
                                        component.set("v.lead" + i + "_ar[7]",  "https://www.dropbox.com/s/dtfi9igycx0b2g4/3red.png?raw=1");
                                        break;
                                    default:
                                        component.set("v.lead" + i + "_ar[7]",  "https://www.dropbox.com/s/904nmmscy4h7v3a/1red.png?raw=1");
                                        break;
                                }
                            }
                            component.set("v.lead" + i + "_ar[12]", all_data[6]);
                            component.set("v.lead" + i + "_ar[13]", all_data[7]);
                            if(all_data[8] == "true"){
                                 switch(all_data[22]){
                                    case '1':
                                        component.set("v.lead" + i + "_ar[8]",  "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
                                        break;
                                    case '2':
                                        component.set("v.lead" + i + "_ar[8]", "https://www.dropbox.com/s/buq92zivq2xlt84/2green.png?raw=1");
                                        break;
                                    case '3':
                                        component.set("v.lead" + i + "_ar[8]",  "https://www.dropbox.com/s/09oio24x1wnc1gf/3green2.png?raw=1");
                                        break;
                                    default:
                                        component.set("v.lead" + i + "_ar[8]",  "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
                                        break;
                                }
                            }
                            else{
                                switch(all_data[22]){
                                    case '1':
                                        component.set("v.lead" + i + "_ar[8]",  "https://www.dropbox.com/s/904nmmscy4h7v3a/1red.png?raw=1");
                                        break;
                                    case '2':
                                        component.set("v.lead" + i + "_ar[8]",  "https://www.dropbox.com/s/iafko1p48eb7skc/2red.png?raw=1");
                                        break;
                                    case '3':
                                        component.set("v.lead" + i + "_ar[8]",  "https://www.dropbox.com/s/dtfi9igycx0b2g4/3red.png?raw=1");
                                        break;
                                    default:
                                        component.set("v.lead" + i + "_ar[8]",  "https://www.dropbox.com/s/904nmmscy4h7v3a/1red.png?raw=1");
                                        break;
                                }
                            }
                            component.set("v.lead" + i + "_ar[14]", all_data[9]);
                            component.set("v.lead" + i + "_ar[15]", all_data[10]);
                            if(all_data[11] == "true"){
                                 switch(all_data[23]){
                                    case '1':
                                        component.set("v.lead" + i + "_ar[9]",  "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
                                        break;
                                    case '2':
                                        component.set("v.lead" + i + "_ar[9]", "https://www.dropbox.com/s/buq92zivq2xlt84/2green.png?raw=1");
                                        break;
                                    case '3':
                                        component.set("v.lead" + i + "_ar[9]",  "https://www.dropbox.com/s/09oio24x1wnc1gf/3green2.png?raw=1");
                                        break;
                                    default:
                                        component.set("v.lead" + i + "_ar[9]",  "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
                                        break;
                                }
                            }
                            else{
                                switch(all_data[23]){
                                    case '1':
                                        component.set("v.lead" + i + "_ar[9]",  "https://www.dropbox.com/s/904nmmscy4h7v3a/1red.png?raw=1");
                                        break;
                                    case '2':
                                        component.set("v.lead" + i + "_ar[9]",  "https://www.dropbox.com/s/iafko1p48eb7skc/2red.png?raw=1");
                                        break;
                                    case '3':
                                        component.set("v.lead" + i + "_ar[9]",  "https://www.dropbox.com/s/dtfi9igycx0b2g4/3red.png?raw=1");
                                        break;
                                    default:
                                        component.set("v.lead" + i + "_ar[9]",  "https://www.dropbox.com/s/904nmmscy4h7v3a/1red.png?raw=1");
                                        break;
                                }
                            }
                            component.set("v.lead" + i + "_ar[16]", all_data[12]);
                            component.set("v.lead" + i + "_ar[17]", all_data[13]);
                            if(all_data[14] == "true"){
                                 switch(all_data[24]){
                                    case '1':
                                        component.set("v.lead" + i + "_ar[10]",  "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
                                        break;
                                    case '2':
                                        component.set("v.lead" + i + "_ar[10]", "https://www.dropbox.com/s/buq92zivq2xlt84/2green.png?raw=1");
                                        break;
                                    case '3':
                                        component.set("v.lead" + i + "_ar[10]",  "https://www.dropbox.com/s/09oio24x1wnc1gf/3green2.png?raw=1");
                                        break;
                                    default:
                                        component.set("v.lead" + i + "_ar[10]",  "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
                                        break;
                                }
                            }
                            else{
                                switch(all_data[24]){
                                    case '1':
                                        component.set("v.lead" + i + "_ar[10]",  "https://www.dropbox.com/s/904nmmscy4h7v3a/1red.png?raw=1");
                                        break;
                                    case '2':
                                        component.set("v.lead" + i + "_ar[10]",  "https://www.dropbox.com/s/iafko1p48eb7skc/2red.png?raw=1");
                                        break;
                                    case '3':
                                        component.set("v.lead" + i + "_ar[10]",  "https://www.dropbox.com/s/dtfi9igycx0b2g4/3red.png?raw=1");
                                        break;
                                    default:
                                        component.set("v.lead" + i + "_ar[10]",  "https://www.dropbox.com/s/904nmmscy4h7v3a/1red.png?raw=1");
                                        break;
                                }
                            }        
                            component.set("v.lead" + i + "_ar[18]", all_data[15]);
                            component.set("v.lead" + i + "_ar[19]", all_data[16]);
                            if(all_data[17] == "true"){
                                 switch(all_data[25]){
                                    case '1':
                                        component.set("v.lead" + i + "_ar[11]",  "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
                                        break;
                                    case '2':
                                        component.set("v.lead" + i + "_ar[11]", "https://www.dropbox.com/s/buq92zivq2xlt84/2green.png?raw=1");
                                        break;
                                    case '3':
                                        component.set("v.lead" + i + "_ar[11]",  "https://www.dropbox.com/s/09oio24x1wnc1gf/3green2.png?raw=1");
                                        break;
                                    default:
                                        component.set("v.lead" + i + "_ar[11 ]",  "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
                                        break;
                                }
                            }
                            else{
                                switch(all_data[25]){
                                    case '1':
                                        component.set("v.lead" + i + "_ar[11]",  "https://www.dropbox.com/s/904nmmscy4h7v3a/1red.png?raw=1");
                                        break;
                                    case '2':
                                        component.set("v.lead" + i + "_ar[11]",  "https://www.dropbox.com/s/iafko1p48eb7skc/2red.png?raw=1");
                                        break;
                                    case '3':
                                        component.set("v.lead" + i + "_ar[11]",  "https://www.dropbox.com/s/dtfi9igycx0b2g4/3red.png?raw=1");
                                        break;
                                    default:
                                        component.set("v.lead" + i + "_ar[11]",  "https://www.dropbox.com/s/904nmmscy4h7v3a/1red.png?raw=1");
                                        break;
                                }
                            }
                            component.set("v.lead" + i + "_ar[20]", all_data[18]);
                            component.set("v.lead" + i + "_ar[21]", all_data[19]);
                        }
                    }
                });
                // Invoke the service
               $A.enqueueAction(action);
            }
            else{
                //add display none
                i++;
                var adjust = i2-1;
                component.set("v.class_cus"+adjust, "invisible");
                //var numstring = "insight" + (i2 - 1);
                //alert(numstring);
                //document.getElementById(component.numstring).style.display = 'none';
            }
        }
		*/
        
        //load Insights
        var oi = 0;
        var oi2 = 1;
        while (oi2 < 7){
            var optid = component.get("v.oppi" + oi2 + "_id");
            var optinsight2 = component.get("v.oppi" + oi2 + "_insight");

            if(optid != "name here"){

                var adjuster2 = oi2 + 2;
                component.set("v.class_cus"+adjuster2, "visible");
               
                //if account insight
                if(optinsight2 == "Acct - Merger and Acquisition" || optinsight2 == "Acct - Company Expanding" || optinsight2 == "Acct - Company Cost Cutting" || optinsight2 == "Acct - Leadership Change" || optinsight2 == "Acct - Prospect Unresponsive" || optinsight2 == "Acct - No Communication"){
                    var action2 = component.get("c.getHomeAccountStuff");
                    action2.setParams({
                        "nameis": component.get("v.oppi" + oi2 + "_id")
                    });
                    // Register the callback function
                    action2.setCallback(this, function(response) {
                        oi++;
                        var data2 = response.getReturnValue();
                        if(data2 != null){
                            var all_data2 = data2.split('#*#');
                        }
                        else{
                            var all_data2 = ['Invalid Account Name','Invalid Account Name','Invalid Account Name','Invalid Account Name','Invalid Account Name','Invalid Account Name','Invalid Account Name','Invalid Account Name','Invalid Account Name','Invalid Account Name','Invalid Account Name','Invalid Account Name','Invalid Account Name','Invalid Account Name','Invalid Account Name'];
                        }
                        //set account name
                        component.set("v.oppi" + oi + "_ar[0]", all_data2[0]);
                        
                        //set account ID
                        component.set("v.oppi" + oi + "_ar[30]", all_data2[14]);

                        //set article titles
                        if(all_data2[2] == "null"){
                            all_data2[2] = "A new future for " + all_data2[0];
                        }
                        if(all_data2[6] == "null"){
                            all_data2[6] = "Welcome change, or not?";
                        }
                        if(all_data2[10] == "null"){
                            all_data2[10] = "The time has come for action at " + all_data2[0];
                        }
                        component.set("v.ins_articles" + oi + "_ar[0]", all_data2[2]);
                        component.set("v.ins_articles" + oi + "_ar[4]", all_data2[6]);
                        component.set("v.ins_articles" + oi + "_ar[8]", all_data2[10]);
                        
                        //set article dates
                        var incr = 3;
                        var incr_adj = 1;
                        while(incr < 12){
                            var daysold = all_data2[incr];
                            if(daysold == "null"){
                                daysold = 1;
                            }
                            var monthsold = Math.round(daysold / 30);
                            var yearsold = Math.round(daysold / 365);
                            if(daysold < 1){
                                component.set("v.ins_articles" + oi + "_ar[" + incr_adj + "]", "Today");
                            }
                            else if(daysold == 1){
                                component.set("v.ins_articles" + oi + "_ar[" + incr_adj + "]", "1 day ago");
                            }
                            else if(daysold < 31){
                                component.set("v.ins_articles" + oi + "_ar[" + incr_adj + "]", daysold + " days ago");
                            }
                            else if(daysold < 365){
                                component.set("v.ins_articles" + oi + "_ar[" + incr_adj + "]", monthsold + " months ago");
                            }
                            else if(yearsold < 2){
                                component.set("v.ins_articles" + oi + "_ar[" + incr_adj + "]", "1 year ago");
                            }
                            else if(yearsold > 1){
                                component.set("v.ins_articles" + oi + "_ar[" + incr_adj + "]", yearsold + " years ago");
                            }
                            else{
                                component.set("v.ins_articles" + oi + "_ar[" + incr_adj + "]", "2 days ago");
                            }
                            incr += 4; 
                            incr_adj += 4;
                        }
                        
                        //set article sources
                        if(all_data2[4] == "null"){
                            all_data2[4] = "Financial Times";
                        }
                        if(all_data2[8] == "null"){
                            all_data2[8] = "San Francisco Chronicle";
                        }
                        if(all_data2[12] == "null"){
                            all_data2[12] = "Wall Street Journal";
                        }
                        component.set("v.ins_articles" + oi + "_ar[2]", all_data2[4]);
                        component.set("v.ins_articles" + oi + "_ar[6]", all_data2[8]);
                        component.set("v.ins_articles" + oi + "_ar[10]", all_data2[12]);
                        //set article urls
                        if(all_data2[5] == "null"){
                            all_data2[5] = "http://ft.com";
                        }
                        if(all_data2[9] == "null"){
                            all_data2[9] = "http://sfchronicle.com";
                        }
                        if(all_data2[13] == "null"){
                            all_data2[13] = "http://wsj.com";
                        }
                        component.set("v.ins_articles" + oi + "_ar[3]", all_data2[5]);
                        component.set("v.ins_articles" + oi + "_ar[7]", all_data2[9]);
                        component.set("v.ins_articles" + oi + "_ar[11]", all_data2[13]);
                        
                        
                        
                        //setup insight details
                        var optinsight = component.get("v.oppi" + oi + "_insight");
                        switch(optinsight){
                            case 'Acct - Merger and Acquisition':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", "M&A activity detected for " + all_data2[0]);
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", "Here are 3 articles about " + all_data2[0] + " and merger and acquisition activity.");
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/zq6gplcsza98gqe/trending_NEUTRAL.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "neut");
                                //set Account Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[0]);
                                //Set articles visible
                                component.set("v.class_cus" + inum + "b[0]", "visible");
                                //set activity invisible
                                component.set("v.class_cus" + inum + "b[1]", "invisible");
                                //set squigle visible
                                component.set("v.class_cus" + inum + "b[2]", "visible");
                                break;
                                
                            case 'Acct - Company Expanding':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", all_data2[0] + " is expanding");
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", "Here are 3 articles about " + all_data2[0] + " expansion.");
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/es337funzub8nan/trending_UP.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "green");
                                //set Account Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[0]);
                                //Set articles visible
                                component.set("v.class_cus" + inum + "b[0]", "visible");
                                //set activity invisible
                                component.set("v.class_cus" + inum + "b[1]", "invisible");
                                //set squigle visible
                                component.set("v.class_cus" + inum + "b[2]", "visible");
                                break;
                                
                            case 'Acct - Company Cost Cutting':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", all_data2[0] + " is cutting costs");
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", "Here are 3 articles about " + all_data2[0] + " and cost-cutting measures.");
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/u7e7n5zf2zggtsn/trending_DOWN.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "red");
                                //set Account Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[0]);
                                //Set articles visible
                                component.set("v.class_cus" + inum + "b[0]", "visible");
                                //set activity invisible
                                component.set("v.class_cus" + inum + "b[1]", "invisible");
                                //set squigle visible
                                component.set("v.class_cus" + inum + "b[2]", "visible");
                                break;
                                
                            case 'Acct - Leadership Change':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", "Leadership changes at " + all_data2[0]);
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", "Here are 3 articles about changes to the executive leadership at " + all_data2[0] + ".");
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/zq6gplcsza98gqe/trending_NEUTRAL.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "neut");
                                //set Account Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[0]);
                                //Set articles visible
                                component.set("v.class_cus" + inum + "b[0]", "visible");
                                //set activity invisible
                                component.set("v.class_cus" + inum + "b[1]", "invisible");
                                //set squigle visible
                                component.set("v.class_cus" + inum + "b[2]", "visible");
                                break;
                                
                            case 'Acct - Prospect Unresponsive':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", "Contact at " + all_data2[0] + " hasn’t responded");
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", "We usually hear back within 4 days, but this contact hasn't responded in 8 days.");
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/u7e7n5zf2zggtsn/trending_DOWN.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "red");
                                //set Account Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[0]);
                                //Set articles invisible
                                component.set("v.class_cus" + inum + "b[0]", "invisible");
                                //set activity invisible
                                component.set("v.class_cus" + inum + "b[1]", "invisible");
                                //set squigle invisible
                                component.set("v.class_cus" + inum + "b[2]", "invisible");
                                break;
                                
                            case 'Acct - No Communication':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", "No communication at " + all_data2[0]);
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", "There’s usually communication about this account every 5 days. So far, there hasn’t been any in 8 days.");
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/u7e7n5zf2zggtsn/trending_DOWN.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "red");
                                //set Account Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[0]);
                                //Set articles invisible
                                component.set("v.class_cus" + inum + "b[0]", "invisible");
                                //set activity invisible
                                component.set("v.class_cus" + inum + "b[1]", "invisible");
                                //set squigle invisible
                                component.set("v.class_cus" + inum + "b[2]", "invisible");
                                break;
                                
                            default:
                                break;
                        }
                    });

                }
                
               //it's an oppty insight 
               else{
                    
                    var action2 = component.get("c.getHomeOpptyStuff");
                    action2.setParams({
                        "nameis": component.get("v.oppi" + oi2 + "_id")
                    });
                    
                    // Register the callback function
                    action2.setCallback(this, function(response) {
                        oi++;
                        var data2 = response.getReturnValue();
                        if(data2 != null){
                            var all_data2 = data2.split('#*#');
                        }
                        else{
                            var all_data2 = ['Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name','Invalid Oppty Name'];
                        }
                        //set account name
                        component.set("v.oppi" + oi + "_ar[0]", all_data2[0]);
                        //set oppty id
                        component.set("v.oppi" + oi + "_ar[30]", all_data2[10]);
                        //set close date
                        component.set("v.oppi" + oi + "_ar[1]", all_data2[1]);
                        //set last activity subject
                        if(all_data2[2] == "null"){
                            all_data2[2] = "RE: Solutions";
                        }
                        component.set("v.oppi" + oi + "_ar[2]", all_data2[2]);
                        //set last activity text
                        if(all_data2[3] == "null"){
                            all_data2[3] = "Jim wanted to talk about our options...";
                        }
                        component.set("v.oppi" + oi + "_ar[3]", all_data2[3]);
                        //set last activity type
                        component.set("v.oppi" + oi + "_ar[4]", all_data2[4]);
                        //set name of contact who mentioned competitor
                        component.set("v.oppi" + oi + "_ar[5]", all_data2[5]);
                        //set competitor they mentioned
                        component.set("v.oppi" + oi + "_ar[6]", all_data2[6]);
                        //set slowing reason
                        if(all_data2[7] == "null"){
                            all_data2[7] = "Emails content"
                        }
                        component.set("v.oppi" + oi + "_ar[7]", all_data2[7]);
                        //set boosting reason
                        if(all_data2[8] == "null"){
                            all_data2[8] = "Emails content"
                        }
                        component.set("v.oppi" + oi + "_ar[8]", all_data2[8]);
                        
                        //setup insight details
                        var optinsight = component.get("v.oppi" + oi + "_insight");
                        switch(optinsight){
                            case 'Oppty - Winning Unlikely':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", "Opportunity is unlikely to close in time");
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", "Recent activity suggests this deal won't be won by " + all_data2[1]);
                                //set picture
                                if(all_data2[4] == "Call"){
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/lpniuoi6dru2vez/phoneicon.png?raw=1");
                                }
                                else{
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/vr2q3nfczjpt925/email.png?raw=1");
                                }
                                //set related text
                                component.set("v.oppi" + oi + "_ar[12]", "Latest Activity - 9 days ago");
                                //set subject
                                component.set("v.oppi" + oi + "_ar[13]", all_data2[2]);
                                //set text blurb
                                component.set("v.oppi" + oi + "_ar[14]", all_data2[3]);
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/u7e7n5zf2zggtsn/trending_DOWN.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "red");
                                //document.getElementById('insight-text' + inum).style.color = "rgb(194, 57, 52)";
                                //set Oppty Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[9]);
                                //Set articles invisible
                                component.set("v.class_cus" + inum + "b[0]", "invisible");
                                //set activity visible
                                component.set("v.class_cus" + inum + "b[1]", "visible");
                                //set squigle visible
                                component.set("v.class_cus" + inum + "b[2]", "visible");                                
                                break;
                                
                            case 'Oppty - Competitor Mentioned':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", "Competitor was mentioned");
                                //set why text
                                var cont = "Jim Hansen";
                                var comp = "Sprint Networks";
                                if(all_data2[5] != "null"){
                                    cont = all_data2[5];
                                }
                                if(all_data2[6] != "null"){
                                    comp = all_data2[6];
                                }
                                component.set("v.oppi" + oi + "_ar[10]", cont + " mentioned " + comp + ".");
                                //set picture
                                component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/vr2q3nfczjpt925/email.png?raw=1");
                                //set related text
                                component.set("v.oppi" + oi + "_ar[12]", "Related email - 4 days ago");
                                //set subject
                                component.set("v.oppi" + oi + "_ar[13]", "RE:Solutions");
                                //set text blurb
                                component.set("v.oppi" + oi + "_ar[14]", "we are currently evaluating other options from " + comp + "...");
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/zq6gplcsza98gqe/trending_NEUTRAL.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "neut");
                                //document.getElementById('insight-text' + inum).style.color = "rgb(22, 50, 92)";
                                //set Oppty Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[9]);
                                //Set articles invisible
                                component.set("v.class_cus" + inum + "b[0]", "invisible");
                                //set activity visible
                                component.set("v.class_cus" + inum + "b[1]", "visible");
                                //set squigle visible
                                component.set("v.class_cus" + inum + "b[2]", "visible"); 
                                break;
                                
                            case 'Oppty - Prospect Unresponsive':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", "Prospect unresponsive");
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", "We usually hear from a prospect within 5 days, but we haven't heard back in 15 days.");
                                //set picture
                                if(all_data2[4] == "Call"){
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/lpniuoi6dru2vez/phoneicon.png?raw=1");
                                }
                                else{
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/vr2q3nfczjpt925/email.png?raw=1");
                                }
                                //set related text
                                component.set("v.oppi" + oi + "_ar[12]", "Latest Activity - 9 days ago");
                                //set subject
                                component.set("v.oppi" + oi + "_ar[13]", all_data2[2]);
                                //set text blurb
                                component.set("v.oppi" + oi + "_ar[14]", all_data2[3]);
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/u7e7n5zf2zggtsn/trending_DOWN.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "red");
                                //document.getElementById('insight-text' + inum).style.color = "rgb(194, 57, 52)";
                                //set Oppty Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[9]);
                                //Set articles invisible
                                component.set("v.class_cus" + inum + "b[0]", "invisible");
                                //set activity visible
                                component.set("v.class_cus" + inum + "b[1]", "visible");
                                //set squigle visible
                                component.set("v.class_cus" + inum + "b[2]", "visible"); 
                                break;
                                
                           case 'Oppty - Deal Slowing':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", "Opportunity slowing");
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", all_data2[7] + " suggests that this deal is less likely to be won.");
                                //set picture
                                if(all_data2[4] == "Call"){
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/lpniuoi6dru2vez/phoneicon.png?raw=1");
                                }
                                else{
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/vr2q3nfczjpt925/email.png?raw=1");
                                }
                                //set related text
                                component.set("v.oppi" + oi + "_ar[12]", "Latest Activity - 9 days ago");
                                //set subject
                                component.set("v.oppi" + oi + "_ar[13]", all_data2[2]);
                                //set text blurb
                                component.set("v.oppi" + oi + "_ar[14]", all_data2[3]);
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/u7e7n5zf2zggtsn/trending_DOWN.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "red");
                                //document.getElementById('insight-text' + inum).style.color = "rgb(194, 57, 52)";
                                //set Oppty Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[9]);
                                //Set articles invisible
                                component.set("v.class_cus" + inum + "b[0]", "invisible");
                                //set activity visible
                                component.set("v.class_cus" + inum + "b[1]", "visible");
                                //set squigle visible
                                component.set("v.class_cus" + inum + "b[2]", "visible"); 
                                break;
                                
                            
                           case 'Oppty - Deal Boosting':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", "Opportunity boosting");
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", all_data2[8] + " suggests that this deal is more likely to be won.");
                                //set picture
                                if(all_data2[4] == "Call"){
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/lpniuoi6dru2vez/phoneicon.png?raw=1");
                                }
                                else{
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/vr2q3nfczjpt925/email.png?raw=1");
                                }
                                //set related text
                                component.set("v.oppi" + oi + "_ar[12]", "Latest Activity - 9 days ago");
                                //set subject
                                component.set("v.oppi" + oi + "_ar[13]", all_data2[2]);
                                //set text blurb
                                component.set("v.oppi" + oi + "_ar[14]", all_data2[3]);
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/es337funzub8nan/trending_UP.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "green");
                                //document.getElementById('insight-text' + inum).style.color = "rgb(2, 128, 72)";
                                //set Oppty Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[9]);
                                //Set articles invisible
                                component.set("v.class_cus" + inum + "b[0]", "invisible");
                                //set activity visible
                                component.set("v.class_cus" + inum + "b[1]", "visible");
                                //set squigle visible
                                component.set("v.class_cus" + inum + "b[2]", "visible"); 
                                break;
                                
                           case 'Oppty - Time-Consuming Oppty':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", "Time-consuming Opportunity");
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", "Too much time might be spent on this deal relative to its value (compared to your previous deals at this stage).");
                                //set picture
                                if(all_data2[4] == "Call"){
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/lpniuoi6dru2vez/phoneicon.png?raw=1");
                                }
                                else{
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/vr2q3nfczjpt925/email.png?raw=1");
                                }
                                //set related text
                                component.set("v.oppi" + oi + "_ar[12]", "Latest Activity - 9 days ago");
                                //set subject
                                component.set("v.oppi" + oi + "_ar[13]", all_data2[2]);
                                //set text blurb
                                component.set("v.oppi" + oi + "_ar[14]", all_data2[3]);
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/zq6gplcsza98gqe/trending_NEUTRAL.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "neut");
                                //document.getElementById('insight-text' + inum).style.color = "rgb(22, 50, 92)";
                                //set Oppty Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[9]);
                                //Set articles invisible
                                component.set("v.class_cus" + inum + "b[0]", "invisible");
                                //set activity visible
                                component.set("v.class_cus" + inum + "b[1]", "visible");
                                //set squigle visible
                                component.set("v.class_cus" + inum + "b[2]", "visible"); 
                                break;
                                
                            case 'Oppty - No Communication':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", "No communication");
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", "There’s usually communication with this opportunity every 3 days. So far, there hasn’t been any in 9 days.");
                                //set picture
                                if(all_data2[4] == "Call"){
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/lpniuoi6dru2vez/phoneicon.png?raw=1");
                                }
                                else{
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/vr2q3nfczjpt925/email.png?raw=1");
                                }
                                //set related text
                                component.set("v.oppi" + oi + "_ar[12]", "Latest Activity - 9 days ago");
                                //set subject
                                component.set("v.oppi" + oi + "_ar[13]", all_data2[2]);
                                //set text blurb
                                component.set("v.oppi" + oi + "_ar[14]", all_data2[3]);
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/u7e7n5zf2zggtsn/trending_DOWN.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "red");
                                //document.getElementById('insight-text' + inum).style.color = "rgb(194, 57, 52)";
                                //set Oppty Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[9]);
                                //Set articles invisible
                                component.set("v.class_cus" + inum + "b[0]", "invisible");
                                //set activity visible
                                component.set("v.class_cus" + inum + "b[1]", "visible");
                                //set squigle visible
                                component.set("v.class_cus" + inum + "b[2]", "visible"); 
                                break;
                                
                            case 'Oppty - Re-engaged':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", "Re-engaged Opportunity");
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", "There's new activity on this inactive opportunity.");
                                //set picture
                                if(all_data2[4] == "Call"){
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/lpniuoi6dru2vez/phoneicon.png?raw=1");
                                }
                                else{
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/vr2q3nfczjpt925/email.png?raw=1");
                                }
                                //set related text
                                component.set("v.oppi" + oi + "_ar[12]", "Latest Activity - 9 days ago");
                                //set subject
                                component.set("v.oppi" + oi + "_ar[13]", all_data2[2]);
                                //set text blurb
                                component.set("v.oppi" + oi + "_ar[14]", all_data2[3]);
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/es337funzub8nan/trending_UP.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "green");
                                //document.getElementById('insight-text' + inum).style.color = "rgb(2, 128, 72)";
                                //set Oppty Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[9]);
                                //Set articles invisible
                                component.set("v.class_cus" + inum + "b[0]", "invisible");
                                //set activity visible
                                component.set("v.class_cus" + inum + "b[1]", "visible");
                                //set squigle visible
                                component.set("v.class_cus" + inum + "b[2]", "visible"); 
                                break;
                                
                            case 'Oppty - Task Overdue':
                                //set title
                                component.set("v.oppi" + oi + "_ar[9]", "Opportunity has overdue task");
                                //set why text
                                component.set("v.oppi" + oi + "_ar[10]", "Task was due 3 days ago.");
                                //set picture
                                if(all_data2[4] == "Call"){
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/lpniuoi6dru2vez/phoneicon.png?raw=1");
                                }
                                else{
                                    component.set("v.oppi" + oi + "_ar[11]", "https://www.dropbox.com/s/vr2q3nfczjpt925/email.png?raw=1");
                                }
                                //set related text
                                component.set("v.oppi" + oi + "_ar[12]", "Latest Activity - 9 days ago");
                                //set subject
                                component.set("v.oppi" + oi + "_ar[13]", all_data2[2]);
                                //set text blurb
                                component.set("v.oppi" + oi + "_ar[14]", all_data2[3]);
                                //set trending image
                                component.set("v.oppi" + oi + "_ar[15]", "https://www.dropbox.com/s/zq6gplcsza98gqe/trending_NEUTRAL.png?raw=1");
                                //set text color
                                var inum = oi + 2;
                                component.set("v.class_col"+inum, "neut");
                                //document.getElementById('insight-text' + inum).style.color = "rgb(22, 50, 92)";
                                //set Oppty Name
                                component.set("v.oppi" + oi + "_ar[16]", all_data2[9]);
                                //Set articles invisible
                                component.set("v.class_cus" + inum + "b[0]", "invisible");
                                //set activity visible
                                component.set("v.class_cus" + inum + "b[1]", "visible");
                                //set squigle visible
                                component.set("v.class_cus" + inum + "b[2]", "visible"); 
                                break;
                                
                            default:
                                
                                break;
                        }                    
                    });
               }
                
                $A.enqueueAction(action2);                    
                    
            }
            else{
                //alert('else');
                component.set("v.class_cus"+adjuster2, "visible");
            }
            oi2++;
        }
                
    },
    
    
    
    
    somethingElse : function(component,event,helper){
		console.log('2tf');
        window.setTimeout(
            $A.getCallback(function() {
                document.getElementsByClassName('insight')[0].classList.remove('fade');
                document.getElementsByClassName('insight')[1].classList.remove('fade');
                document.getElementsByClassName('insight')[2].classList.remove('fade');
                document.getElementsByClassName('insight')[3].classList.remove('fade');
                document.getElementsByClassName('insight')[4].classList.remove('fade');
                document.getElementsByClassName('insight')[5].classList.remove('fade');
                document.getElementById('placeholder1').classList.add('show');
            }), 800
        );
        
        window.setTimeout(
            $A.getCallback(function() {
                document.getElementById('placeholder2').classList.add('show');
                document.getElementsByClassName('insight')[1].classList.add('drop');
                document.getElementsByClassName('insight')[2].classList.add('follow1');
                document.getElementsByClassName('insight')[3].classList.add('follow1');
                document.getElementsByClassName('insight')[4].classList.add('follow1');
                document.getElementsByClassName('insight')[5].classList.add('follow1');
            }), 1000
        );
        window.setTimeout(
            $A.getCallback(function() {
                document.getElementById('placeholder3').classList.add('show');                
                document.getElementsByClassName('insight')[2].classList.add('drop');
                document.getElementsByClassName('insight')[3].classList.add('follow2');
                document.getElementsByClassName('insight')[4].classList.add('follow2');
                document.getElementsByClassName('insight')[5].classList.add('follow2');
            }), 1500
        );
        window.setTimeout(
            $A.getCallback(function() {
                document.getElementById('placeholder4').classList.add('show');                
                document.getElementsByClassName('insight')[3].classList.add('drop');
                document.getElementsByClassName('insight')[4].classList.add('follow3');
                document.getElementsByClassName('insight')[5].classList.add('follow3');
            }), 2000
        );
        window.setTimeout(
            $A.getCallback(function() {
                document.getElementById('placeholder5').classList.add('show');                
                document.getElementsByClassName('insight')[4].classList.add('drop');
                document.getElementsByClassName('insight')[5].classList.add('follow4');
            }), 2500
        );
        window.setTimeout(
            $A.getCallback(function() {
                document.getElementById('placeholder6').classList.add('show');                
                document.getElementsByClassName('insight')[5].classList.add('drop');
            }), 3000
        );
        
        window.setTimeout(
            $A.getCallback(function() {
                document.getElementById('placeholder1').classList.remove('show');     
                document.getElementById('placeholder2').classList.remove('show');     
                document.getElementById('placeholder3').classList.remove('show');     
                document.getElementById('placeholder4').classList.remove('show');     
                document.getElementById('placeholder5').classList.remove('show');     
                document.getElementById('placeholder6').classList.remove('show');
                
                document.getElementsByClassName('insight')[0].classList.add('regular');
                document.getElementsByClassName('insight')[1].classList.add('regular');
                document.getElementsByClassName('insight')[2].classList.add('regular');
                document.getElementsByClassName('insight')[3].classList.add('regular');
                document.getElementsByClassName('insight')[4].classList.add('regular');
                document.getElementsByClassName('insight')[5].classList.add('regular');
                
                document.getElementsByClassName('insight')[0].classList.remove('drop');
                document.getElementsByClassName('insight')[1].classList.remove('drop');
                document.getElementsByClassName('insight')[2].classList.remove('drop');
                document.getElementsByClassName('insight')[3].classList.remove('drop');
                document.getElementsByClassName('insight')[4].classList.remove('drop');
                document.getElementsByClassName('insight')[5].classList.remove('drop');

				document.getElementById('insightsLogo').src="https://www.dropbox.com/s/u408oaljtmphwen/loader-grey-static.png?raw=1";
            }), 3600
        );
        
        
		
	},
    navigateToLead : function(component, event, helper){
        var lead1_id = component.get("v.lead1_ar[26]");
       window.location.hash = "/sObject/" + lead1_id + "/view";
    },
    
    navigateToLead2 : function(component, event, helper){
        var lead2_id = component.get("v.lead2_ar[26]");
       window.location.hash = "/sObject/" + lead2_id + "/view";
    },
    
    navigateToLead3 : function(component, event, helper){
        var lead3_id = component.get("v.lead3_ar[26]");
       window.location.hash = "/sObject/" + lead3_id + "/view";
    },
    
    navigateToOppty1 : function(component, event, helper){
        var oppty_id = component.get("v.oppi1_ar[30]");
       window.location.hash = "/sObject/" + oppty_id + "/view";
    },
    navigateToOppty2 : function(component, event, helper){
        var oppty_id = component.get("v.oppi2_ar[30]");
       window.location.hash = "/sObject/" + oppty_id + "/view";
    },
    navigateToOppty3 : function(component, event, helper){
        var oppty_id = component.get("v.oppi3_ar[30]");
       window.location.hash = "/sObject/" + oppty_id + "/view";
    },
    navigateToOppty4 : function(component, event, helper){
        var oppty_id = component.get("v.oppi4_ar[30]");
       window.location.hash = "/sObject/" + oppty_id + "/view";
    },
    navigateToOppty5 : function(component, event, helper){
        var oppty_id = component.get("v.oppi5_ar[30]");
       window.location.hash = "/sObject/" + oppty_id + "/view";
    },
    navigateToOppty6 : function(component, event, helper){
        var oppty1_id = component.get("v.oppi6_ar[30]");
       window.location.hash = "/sObject/" + oppty1_id + "/view";
    },
    
 
    expandInsight : function(component,event,helper){
        var el = event.srcElement;
   		var id = el.dataset.id;//id here is from 'data-id' in the element
        
        var cmpTarget = component.find('content'+id);
	    $A.util.toggleClass(cmpTarget, 'expand');
    },
    fadeInsight : function(component,event,helper){
        var el = event.srcElement;
   		var id = el.dataset.id;//id here is from 'data-id' in the element
        
		document.getElementById('insight'+id).classList.add('fade');
        window.setTimeout(
            $A.getCallback(function() {
                document.getElementById('insight'+id).classList.add('hide');
            }), 800
        );
    },
	handleClick : function(component, event, helper) {
		var cmpTarget = component.find('hover');
	    $A.util.toggleClass(cmpTarget, 'show');
	},
	closeBox : function(component, event, helper) {
		var cmpTarget = component.find('hover');
	    $A.util.removeClass(cmpTarget, 'show');
	},
    emailDock : function(component,event){
        /*var el = event.srcElement;
   		var id = el.dataset.id;//id here is from 'data-id' in the element
        
        var li = component.get("v.lastInsight");
        component.set("v.lastInsight",id);

        var cmpTarget = component.find('content'+id);
	    $A.util.toggleClass(cmpTarget, 'expand');
        
        var cmpTarget = component.find('hover');
	    $A.util.removeClass(cmpTarget, 'show');
        var cmpTarget = component.find('aDock');
	    $A.util.addClass(cmpTarget, 'bounce');
        window.setTimeout(
            $A.getCallback(function() {
                var cmpTarget = component.find('aDock');
            	$A.util.addClass(cmpTarget, 'active');
            }), 300
        );*/
    },
    closeDock : function(component,event){
        var id  = component.get("v.lastInsight");
        document.getElementById('insight'+id).classList.add('fade');
        window.setTimeout(
            $A.getCallback(function() {
                document.getElementById('insight'+id).classList.add('hide');
            }), 800
        );
        
        
        var cmpTarget = component.find('aDock');
	    $A.util.removeClass(cmpTarget, 'active');
        $A.util.removeClass(cmpTarget, 'bounce');
    },
    
    acceptDiscount : function(component,event){
        /*
        var cmpTarget = component.find('hover');
	    $A.util.toggleClass(cmpTarget, 'show');
        
        var acceptAction = component.get("c.accepted");
        acceptAction.setCallback(this,(response)=>{
            var state = response.getState();
            if(state=="SUCCESS"){
                console.log(response.getReturnValue());
            	$A.get('e.force:refreshView').fire();            
				doAllThat(1);
            }
        });
		function doAllThat(num){
            console.log('go '+num);
            if(num == 1){
                document.getElementById('insight-img1').classList.add('rotateNeutral');
                setTimeout(()=>{
                    document.getElementById('insight-img1-rep').classList.add('show');

                    document.getElementById('insight-img1').classList.add('disappear');
                    
                    document.getElementById('insight1').classList.remove('down');
                    setTimeout(function(){
                    	doAllThat(num+1);
                	},1000)
                },1000)
            }else{
                document.getElementById('insight-img'+num).classList.add('rotate');
                setTimeout(()=>{
                    document.getElementById('insight-img'+num+'-rep').classList.add('show');

                    document.getElementById('insight-img'+num).classList.add('disappear');
                    
                    document.getElementById('insight'+num).classList.remove('down');
                    document.getElementById('insight'+num).classList.add('up');
                    
                    if(num==2) document.getElementById('insight-text2').innerHTML = "ElectroZ LLC Recommended";
                    if(num==3) document.getElementById('insight-text3').innerHTML = "Likely to Close in Time";
                    if(num<3){		
                    	setTimeout(function(){
                            doAllThat(num+1);
                        },1000)
					}
                    
                },1000)
            }
        }
        $A.enqueueAction(acceptAction);
        */
	}
})