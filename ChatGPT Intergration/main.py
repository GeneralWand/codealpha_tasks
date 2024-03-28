import openai
import websocket
import json

# Uncomment and  modify the following lines to use your own API key
# openai.api_key = "your-api-key"

def chat_with_gpt(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content.strip()

def on_message(ws, message):
    user_input = json.loads(message)['message']
    response = chat_with_gpt(user_input)
    ws.send(json.dumps({'message': response}))

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    print("### WebSocket Opened ###")

if __name__ == "__main__":
    ws = websocket.WebSocketApp("ws://localhost:6969/",
                              on_message=on_message,
                              on_error=on_error,
                              on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()
