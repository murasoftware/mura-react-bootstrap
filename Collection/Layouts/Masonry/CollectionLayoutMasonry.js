import { useState } from "react";
import React from 'react';
import Card from 'react-bootstrap/Card';
import OutputMarkup from "@mura/react-bootstrap/Utilities/OutputMarkup";
import CollectionNav from '@mura/react-bootstrap/CollectionNav/CollectionNav';
import ItemDate from '@mura/react-bootstrap/Utilities/ItemDate';
import CollectionReadMoreBtn from '@mura/react-bootstrap/Utilities/CollectionReadMoreBtn';
import ItemCredits from '@mura/react-bootstrap/Utilities/ItemCredits';
import ItemTags from '@mura/react-bootstrap/Utilities/ItemTags';

/*
  The link component throws an error when rerending after being 
  reconfigured in edit mode. Hence CollectionLink
*/
const Masonry = ({props,collection,link}) => {
  const [pos, setPos] = useState(0);
  return (
    <>
      <div className={`collectionLayoutMasonry card-columns`}>
          <CurrentItems collection={collection} pos={pos} link={link} {...props} /> 
      </div>
      <div className="row">
        <div className="col-12">
        <CollectionNav collection={collection} pos={pos} setPos={setPos} link={link} {...props} />
        </div>
      </div>
    </>
  )
}

const CurrentItems = (props) => {
  const {collection,nextn,link,pos,fields} = props;
  let itemsList = [];
  let item = '';
  const Link = link;
  const items = collection.get('items');
  let itemsTo = pos+nextn > items.length ? items.length : pos+nextn;
  const fieldlist = fields ? fields.toLowerCase().split(",") : [];
  const maxItems = props.maxitems;
  // console.log('fieldlist: ' + fieldlist);

  if (maxItems < items.length && pos+nextn > maxItems){
    itemsTo = maxItems;
  }
  
  for(let i = pos;i < itemsTo;i++) {
    item = items[i];
    itemsList.push(
      
      <Card className="mb-3 h-100 shadow" key={item.get('contentid')}>
        {
          fieldlist.filter(field => field == 'image').map(filteredField => (
            <Card.Img variant="top" src={item.get('images')[props.imagesize]} key={item.get('fileid')} />
          ))
        }
        <Card.Body>
          <div className="mura-item-meta">
            {
            fieldlist.map(field => {
              switch(field) {
                case "title":
                  return (
                    <Card.Title key={field}>{item.get('title')}</Card.Title>
                  )
                case "date":
                case "releasedate":
                    return (
                      <div className="mura-item-meta__date" key="date">
                        <ItemDate releasedate={item.get('releasedate')} lastupdate={item.get('lastupdate')}></ItemDate>
                      </div>
                    );
                case "summary":
                  return <OutputMarkup source={item.get('summary')} key={field} />
                case "credits":
                    if(item.get('credits').length){
                      return (
                        <div className="mura-item-meta__credits">
                          <ItemCredits credits={item.get('credits')} key="credits" />
                        </div>
                      );
                    }
                    return null;
                case "tags":
                    return (
                        <div className="mura-item-meta__tags pb-2" key="tags">
                          <ItemTags tags={item.get('tags')} />
                        </div>
                    );
                default:
                  return <div className={`mura-item-meta__${field}`} key={field} data-value={item.get(field)}>{item.get(field)}</div>
              }        
            })
            }
          </div>
        </Card.Body>
        <Card.Footer>
          <CollectionReadMoreBtn
            href={`/${item.get('filename')}`}
            ctatext="Read More"
            link={Link}
            key={item.get('contentid')}
          />
        </Card.Footer>

      </Card>
    );
  }

  return itemsList;
}

/*
  This is not required; it is used to retrieve the required fields when populated getStatic/getServerSide props
*/
export const getQueryProps = () => {
  const data = {};
  data['fields'] = "title,summary";

  return data;
};

export default Masonry;