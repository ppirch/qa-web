import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import {
  Container, Typography, Box, Link, AppBar, TextField, Button, Toolbar, Stack,
  Select,
  SelectChangeEvent, InputLabel, FormControl, MenuItem, Card, CardActions, CardContent, CardMedia, CircularProgress
} from '@mui/material'
import { styled, alpha } from '@mui/material/styles';
import axios from 'axios'

interface AnswerObj {
  context: Context
  answer: Answer
}

interface Context {
  title: string
  link: string
  text: string
}

interface Answer {
  score: number
  start: number
  end: number
  answer: string
}


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.cmu.ac.th/">
        Chiang Mai University
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function App() {

  const [question, setQuestion] = useState<string>('Machine Learning คืออะไร');
  const [model, setModel] = useState<string>('wangchanberta');
  const [answers, setAnswers] = useState<Array<AnswerObj>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleModelChange = (event: SelectChangeEvent) => {
    setModel(event.target.value as string);
  };

  const handleGoClick = async () => {
    const API_URL = "https://pirch-api.everythink.dev/qa/"
    setLoading(true)
    setAnswers([])
    const res = await axios.post<Array<AnswerObj>>(API_URL, { context: "", question: question, model: model })
    setLoading(false)
    setAnswers(res.data)
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Question Answering System
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '80vh',
          }}>
          <Stack spacing={2} direction="row">
            <TextField
              required
              id="questin-input"
              label="Question"
              value={question}
              onChange={handleQuestionChange}
              fullWidth
            />
            <FormControl sx={{ m: 1, minWidth: 240 }} >
              <InputLabel id="qa-model">Model</InputLabel>
              <Select
                labelId="qa-model"
                id="qa-model-select"
                value={model}
                label="Model"
                onChange={handleModelChange}
              >
                <MenuItem value={"wangchanberta"}>WangchanBERTa</MenuItem>
                <MenuItem value={"xlm-roberta"}>XLM-RoBERTa</MenuItem>
                <MenuItem value={"bert"}>BERT</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" onClick={handleGoClick} disabled={loading}>GO</Button>
          </Stack>
          {loading && <Box sx={{ display: 'flex'}} alignItems="center" justifyContent="center" marginTop={4}> <CircularProgress /> </Box>}
          <Stack sx={{
            mt: 2,
          }} spacing={2}>
            {answers.map((answer, index) =>
            (
              <Card variant="outlined" key={index}>
                <CardContent>
                  <Typography sx={{ mt: 1.5 }} color="text.secondary">
                    {answer.context.title}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {answer.answer.answer.replaceAll(".", "")}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Score : {answer.answer.score.toFixed(5)}
                  </Typography>
                  <Typography variant="body2">
                    {answer.context.text}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" href={answer.context.link + "#:~:text=" + answer.answer.answer.replaceAll(".", "")} target="_blank">Learn More</Button>
                </CardActions>
              </Card>
            )
            )}
          </Stack>
        </Box>
      </Container>
      <Copyright />
    </>
  )
}

export default App
