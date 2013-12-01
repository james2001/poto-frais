var operation = "A"; //"A"=Adding; "E"=Editing
var selected_index = -1; //Index of the selected list item
var liste_frais = JSON.parse(localStorage.getItem("liste_frais"));//Retrieve the stored data
var personnes;
if (liste_frais == null) //If there is no data, initialize an empty array
    liste_frais = [];

var data;
var labels;
var colors = ["#FFDAB9", "#E6E6FA", "#E0FFFF"];

$(document).ready(function() {
    List();
});

$(document).on('click',"#btnSave",function() {
        if(checkValide())
        {
            if (operation == "A")
                Add();
            else
                Edit();
            List();
            clean();
            $('#add_modal').modal('hide');
        }
        return true;
    });
$(document).on('click','#btnClose',function(){
    clean();
});    
$(document).on('click',".edit_frais",function() {
     operation = "E";
    selected_index = $(this).attr('id').substring(5);
    setFraisFromJSON();
    $('#add_modal').modal('show');
    
//    return true;
});
$(document).on('click',"#btnModalDelete",function() {
    Delete();
    $('#add_modal').modal('hide');
    List();
});
    
    
    
function clean()
{
    $('#frmCadastre')[0].reset();
    operation = "A";
    selected_index = -1;
}

function getFraisToJSON()
{
    return JSON.stringify({
        type: $("#txtType").val(),
        personne: $("#txtPersonne").val(),
        montant: $("#txtMontant").val(),
        position: $("#txtPosition").val(),
        mode: $("#txtMode").val(),
    });
}

function setFraisFromJSON()
{
    var frais = JSON.parse(liste_frais[selected_index]);
    $("#txtType").val(frais.type);
    $("#txtPersonne").val(frais.personne);
    $("#txtMontant").val(frais.montant);
    $("#txtPosition").val(frais.position);
    $("#txtMode").val(frais.mode);
    return true;
}

function Add() {
    var frais = getFraisToJSON();
    liste_frais.push(frais);
    localStorage.setItem("liste_frais", JSON.stringify(liste_frais));
    return true;
}

function Edit() {
    liste_frais[selected_index] = getFraisToJSON();
    localStorage.setItem("liste_frais", JSON.stringify(liste_frais));
    operation = "A"; //Return to default value
    return true;
}

function Delete() {
    liste_frais.splice(selected_index, 1);
    localStorage.setItem("liste_frais", JSON.stringify(liste_frais));
    clean();
}

function List() {
    $("#liste_depense tbody").html("");
    personnes = new Array();
    for (var i in liste_frais) {
        var frais = JSON.parse(liste_frais[i]);
        $("#liste_depense tbody").append("<tr id='frais"+i+"' class='edit_frais'>" +
                " <td>" + frais.type + "</td>" +
                " <td>" + frais.personne + "</td>" +
                " <td>" + frais.montant + "</td>" +
                " <td>" + frais.position + "</td>" +
                " <td class='mode'>" + frais.mode + "</td>" +
                "</tr>");
        if(personnes[frais.personne] === undefined)
        {
            personnes[frais.personne] = new Array(frais.montant);
        }
        else
        {
            personnes[frais.personne].push(frais.montant);
        }
    }
    personnesHtml();
}

function getSumPersonne(j)
{
    var sum = 0;
    for(i in personnes[j])
    {
        sum+=parseInt(personnes[j][i]);
    }
    
    return sum;
}
function getTotal()
{
   var sum = 0;
   for(p in personnes)
   {
       sum += getSumPersonne(p);
   }
   return sum;
}
function getMoyen()
{
    var nb_personne = 0;
    for(p in personnes)
    {
        nb_personne++;
    }
    return getTotal()/nb_personne;//personnes.length;
}

function getMontantPersonne(p)
{
    return Math.round((getSumPersonne(p)-getMoyen())*100)/100;
}

function personnesHtml()
{
    var html = "";
    data = new Array();
    labels = new Array();
    
    for(personne in personnes)
    {
        html += "<li>"+personne;
        labels.push(personne);
        data.push(getSumPersonne(personne)/getTotal()*360);
        
        montant = getMontantPersonne(personne);
        
        if(montant<0)
        {
            html += " doit "+ Math.abs(montant)+" €";
        }
        else
        {
            html += " recoit "+montant+" €";
        }
        html +="</li>";
    }
    $('#ulEquilibre').html(html);
    canvas = document.getElementById("piechart");
    var context = canvas.getContext("2d");
    for (var i = 0; i < data.length; i++) {
        drawSegment(canvas, context, i);
    }
    return true;
}

function checkValide()
{
    return document.getElementById('txtType').validity.valid && 
           document.getElementById('txtPersonne').validity.valid &&
           document.getElementById('txtMontant').validity.valid &&
           document.getElementById('txtPosition').validity.valid &&
           document.getElementById('txtMode').validity.valid;
}


function drawSegment(canvas, context, i) {
    context.save();
    var centerX = Math.floor(canvas.width / 2);
    var centerY = Math.floor(canvas.height / 2);
    radius = Math.floor(canvas.width / 2);

    var startingAngle = degreesToRadians(sumTo(data, i));
    var arcSize = degreesToRadians(data[i]);
    var endingAngle = startingAngle + arcSize;

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, 
                startingAngle, endingAngle, false);
    context.closePath();
    
    context.fillStyle = getColor(i,data.length);// colors[i%colors.length];
    context.fill();

    context.restore();

    drawSegmentLabel(canvas, context, i);
}

function getColor(i, max)
{
    var index_c = i;
    if(index_c+1 == max && colors.length-1!=index_c)
    {
       index_c++;
    }
    
    return colors[index_c%colors.length];
    
}

function degreesToRadians(degrees) {
    return (degrees * Math.PI)/180;
}
function sumTo(a, i) {
    var sum = 0;
    for (var j = 0; j < i; j++) {
      sum += a[j];
    }
    return sum;
}

function drawSegmentLabel(canvas, context, i) {
   context.save();
   var x = Math.floor(canvas.width / 2);
   var y = Math.floor(canvas.height / 2);
   var angle_d = sumTo(data, i);
   var dx = Math.floor(canvas.width * 0.5) - 10;
   var dy = Math.floor(canvas.height * 0.05);
   var align = "right";
   if(angle_d>90 && angle_d<270)
   {
       angle_d -= 180;
       dx = - Math.floor(canvas.width * 0.5)+10;
       dy = - Math.floor(canvas.height * 0.05)-5;
       align = "left";
       context.textBaseline = "top";
   }
   
   var angle = degreesToRadians(angle_d);

   context.translate(x, y);
   context.rotate(angle);
   

   context.textAlign = align;
   var fontSize = Math.floor(canvas.height / 25);
   context.font = fontSize + "pt Helvetica";

   context.fillText(labels[i], dx, dy);

   context.restore();
}

