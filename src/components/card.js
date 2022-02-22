import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Edit } from '@mui/icons-material';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function truncate(source, size) {
  return source.length > size ? source.slice(0, size - 1) + "…" : source;
}

export default function SeminarCard({data, editable, onEdit}) {
  const defaultImg = "https://en.uit.no/Content/534983/cache=1505474594000/grid-AI.jpg"
  const image = data.image || defaultImg

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card id="seminar-card">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "rgb(239, 129, 20)" }} aria-label="recipe">
            {data.presenter[0]}
          </Avatar>
        }
        action={ editable && (
          <IconButton aria-label="settings" onClick={onEdit}>
            <Edit />
          </IconButton>
        )}
        title={truncate(data.topic, 30)}
        subheader={new Date(data.date).toLocaleDateString("NO", { day: "numeric", month: "short", year: "numeric" })}
      />
      <CardMedia
        component="img"
        height="194"
        image={image}
        alt="generic ai image"
      />
      <CardContent>
        <Typography variant="body1" color="text.secondary">
          {data.topic}
        </Typography>
        &nbsp;
        {data.link && (
          <Typography variant="body2" color="text.secondary">
            See more <a href={data.link}>here</a>
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          Presented by {data.presenter}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="share" onClick={() => alert("This should copy the url of the presentation notes")}>
          <ShareIcon />
        </IconButton>
        {data.description && (
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        )}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {data.description && (
            <Typography paragraph>
              {data.description}
            </Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}
