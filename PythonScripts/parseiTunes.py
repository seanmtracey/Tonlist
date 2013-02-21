#Based on code found at -
#https://www.google.co.uk/url?sa=t&rct=j&q=&esrc=s&source=web&cd=3&ved=0CEAQFjAC&url=https%3A%2F%2Fcode.oregonstate.edu%2Fsvn%2Fcspfl%2Ftrunk%2Fhardware%2FOSWALD_CORE.1%2FDocuments%2FPython%2FXML.pdf&ei=WgLxUKDYLZCS0QXkq4DoDA&usg=AFQjCNFPfU-X3fJljO9QHBYjUpu3onUbEA&bvm=bv.1357700187,d.d2k&cad=rja

import xml.dom.minidom

def removeText (node): 
    return [x for x in node.childNodes if x.nodeType != xml.dom.Node.TEXT_NODE]
    
def readInfo (tag, node): 
    if node.nodeType != xml.dom.Node.ELEMENT_NODE: 
        return None 
    if node.tagName == 'string':
        return node.firstChild.data
    elif node.tagName == 'integer':
        return int(node.firstChild.data) 
    elif node.tagName == 'date':
        return node.firstChild.data
    elif node.tagName == 'dict': 
        return readKeys(removeText(node))
    return None

def readKeys (lst): 
    i=0
    dict = { }
    while i < len(lst):
        if lst[i].nodeType == xml.dom.Node.ELEMENT_NODE and lst[i].tagName == 'key':
            tag = lst[i].firstChild.data
            i += 1
            dict[tag] = readInfo(tag, lst[i])
        i += 1 
    return dict

itunesdb = xml.dom.minidom.parse("/Users/Sean/Music/iTunes/iTunes Music Library.xml")
topnodes = removeText(itunesdb.documentElement)
topdict = readKeys(removeText(topnodes[0]))
trackdict = topdict.get('Tracks', {})